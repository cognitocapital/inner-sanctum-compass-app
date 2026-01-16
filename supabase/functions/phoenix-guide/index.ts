import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserContext {
  profile: {
    display_name: string | null;
    primary_goals: string[] | null;
    injury_type: string | null;
    daily_goal_minutes: number | null;
  };
  progress: {
    current_level: number;
    current_streak: number;
    total_xp: number;
  };
  recentCheckins: Array<{
    check_date: string;
    mood: number | null;
    energy_level: number | null;
    sleep_quality: number | null;
    symptoms_today: string[] | null;
  }>;
  todaysCheckin: {
    mood: number | null;
    energy_level: number | null;
    sleep_quality: number | null;
    symptoms_today: string[] | null;
  } | null;
  recentSessions: Array<{
    module_type: string;
    created_at: string;
    duration_seconds: number | null;
    xp_earned: number | null;
    metrics: Record<string, unknown> | null;
  }>;
  moduleStats: Record<string, { sessions: number; totalMinutes: number; avgScore: number }>;
  clinicalAssessments: Array<{
    assessment_type: string;
    score: number | null;
    created_at: string;
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user context including session logs and clinical assessments
    const [profileRes, progressRes, checkinsRes, sessionsRes, assessmentsRes] = await Promise.all([
      supabase.from("profiles").select("display_name, primary_goals, injury_type, daily_goal_minutes").eq("id", user.id).single(),
      supabase.from("user_progress").select("current_level, current_streak, total_xp").eq("user_id", user.id).single(),
      supabase.from("daily_checkins").select("check_date, mood, energy_level, sleep_quality, symptoms_today").eq("user_id", user.id).order("check_date", { ascending: false }).limit(7),
      supabase.from("session_logs").select("module_type, created_at, duration_seconds, xp_earned, metrics").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
      supabase.from("clinical_assessments").select("assessment_type, score, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
    ]);

    const today = new Date().toISOString().split("T")[0];
    const todaysCheckin = checkinsRes.data?.find((c: { check_date: string }) => c.check_date === today) || null;

    // Calculate module stats from session logs
    const moduleStats: Record<string, { sessions: number; totalMinutes: number; avgScore: number }> = {};
    const sessions = sessionsRes.data || [];
    
    for (const session of sessions) {
      const moduleType = session.module_type;
      if (!moduleStats[moduleType]) {
        moduleStats[moduleType] = { sessions: 0, totalMinutes: 0, avgScore: 0 };
      }
      moduleStats[moduleType].sessions++;
      moduleStats[moduleType].totalMinutes += (session.duration_seconds || 0) / 60;
      
      // Extract score from metrics if available
      const metrics = session.metrics as Record<string, unknown> | null;
      if (metrics && typeof metrics.score === 'number') {
        const currentAvg = moduleStats[moduleType].avgScore;
        const currentCount = moduleStats[moduleType].sessions - 1;
        moduleStats[moduleType].avgScore = (currentAvg * currentCount + metrics.score) / moduleStats[moduleType].sessions;
      }
    }

    const context: UserContext = {
      profile: profileRes.data || { display_name: null, primary_goals: null, injury_type: null, daily_goal_minutes: 10 },
      progress: progressRes.data || { current_level: 1, current_streak: 0, total_xp: 0 },
      recentCheckins: checkinsRes.data || [],
      todaysCheckin,
      recentSessions: sessions.slice(0, 10),
      moduleStats,
      clinicalAssessments: assessmentsRes.data || [],
    };

    // Build the AI prompt with richer context
    const systemPrompt = `You are the Phoenix Companion, a warm, compassionate AI guide for TBI/brain injury recovery. 
You speak with wisdom and encouragement, using phoenix metaphors about rising, transformation, and renewal.
You NEVER give medical advice - always suggest consulting healthcare professionals for medical concerns.
You are encouraging but realistic about recovery challenges.

Your personality:
- Warm and empathetic, like a wise friend
- Uses phoenix/fire metaphors naturally (rising from ashes, spreading wings, inner flame)
- Celebrates small wins enthusiastically
- Acknowledges struggles without dwelling on them
- Focuses on actionable, achievable next steps

You have access to detailed session data and can make specific recommendations based on:
- Which modules the user has been practicing most/least
- Their performance trends (improving, stable, declining)
- Clinical assessment scores (PHQ-9, GAD-7, GOSE, etc.)
- Which cognitive domains need the most attention`;

    // Build module usage summary
    const moduleUsageSummary = Object.entries(moduleStats)
      .map(([mod, stats]) => `${mod}: ${stats.sessions} sessions, ${Math.round(stats.totalMinutes)} min total${stats.avgScore > 0 ? `, avg score ${Math.round(stats.avgScore)}%` : ''}`)
      .join('\n') || 'No sessions recorded yet';

    // Build clinical assessment summary
    const clinicalSummary = context.clinicalAssessments.length > 0
      ? context.clinicalAssessments.slice(0, 5).map(a => 
          `${a.assessment_type}: ${a.score} (${new Date(a.created_at).toLocaleDateString()})`
        ).join('\n')
      : 'No clinical assessments recorded';

    // Identify weak/strong areas
    const domainAnalysis = analyzeDomains(context);

    const userPrompt = `Based on this user's comprehensive data, generate a personalized daily recommendation:

USER CONTEXT:
- Name: ${context.profile.display_name || "Friend"}
- Recovery Goals: ${context.profile.primary_goals?.join(", ") || "General wellness"}
- Injury Type: ${context.profile.injury_type || "Not specified"}
- Current Level: ${context.progress.current_level} (Phoenix ${context.progress.current_level < 10 ? "Hatchling" : context.progress.current_level < 25 ? "Fledgling" : "Rising Phoenix"})
- Current Streak: ${context.progress.current_streak} days
- Total XP: ${context.progress.total_xp}
- Daily Goal: ${context.profile.daily_goal_minutes || 10} minutes

TODAY'S CHECK-IN:
${context.todaysCheckin ? `
- Mood: ${context.todaysCheckin.mood}/5
- Energy: ${context.todaysCheckin.energy_level}/5
- Sleep: ${context.todaysCheckin.sleep_quality}/5
- Symptoms: ${(context.todaysCheckin.symptoms_today as string[])?.join(", ") || "None reported"}
` : "No check-in yet today"}

RECENT MOOD TRENDS (last 7 days):
${context.recentCheckins.length > 0 ? context.recentCheckins.map(c => 
  `- ${c.check_date}: Mood ${c.mood}/5, Energy ${c.energy_level}/5, Sleep ${c.sleep_quality}/5`
).join("\n") : "No recent data"}

MODULE USAGE (all time):
${moduleUsageSummary}

CLINICAL ASSESSMENTS:
${clinicalSummary}

DOMAIN ANALYSIS:
${domainAnalysis}

RECENT ACTIVITY (last 10 sessions):
${context.recentSessions.slice(0, 5).map(s => 
  `- ${s.module_type}: ${Math.round((s.duration_seconds || 0) / 60)} min, +${s.xp_earned || 0} XP (${new Date(s.created_at).toLocaleDateString()})`
).join("\n") || "No recent sessions"}

Generate a JSON response with:
1. A recommended module (one of: breathing, mind, gratitude, cold-exposure, incog)
2. A specific exercise within that module (be specific based on their data)
3. Suggested duration in minutes (consider their energy level and daily goal)
4. A personalized reason for this recommendation (reference their specific data)
5. An encouraging message (2-3 sentences, use phoenix metaphors)
6. One insight based on their data trends (be specific about what you noticed)`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_recommendation",
              description: "Generate a personalized daily recovery recommendation",
              parameters: {
                type: "object",
                properties: {
                  module: { 
                    type: "string", 
                    enum: ["breathing", "mind", "gratitude", "cold-exposure", "incog"],
                    description: "The recommended module"
                  },
                  exercise: { type: "string", description: "Specific exercise name" },
                  duration: { type: "number", description: "Duration in minutes" },
                  reason: { type: "string", description: "Why this is recommended (personalized)" },
                  message: { type: "string", description: "Encouraging message with phoenix metaphors" },
                  insight: { type: "string", description: "One data-driven insight about their progress" },
                },
                required: ["module", "exercise", "duration", "reason", "message", "insight"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_recommendation" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall || toolCall.function.name !== "generate_recommendation") {
      throw new Error("Invalid AI response structure");
    }

    const recommendation = JSON.parse(toolCall.function.arguments);

    // Store the recommendation
    await supabase.from("ai_recommendations").upsert({
      user_id: user.id,
      recommendation_date: today,
      recommendations: recommendation,
      priority_module: recommendation.module,
      reason: recommendation.reason,
    }, {
      onConflict: "user_id,recommendation_date",
    });

    return new Response(JSON.stringify(recommendation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Phoenix guide error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      // Fallback recommendation
      fallback: {
        module: "breathing",
        exercise: "4-7-8 Breathing",
        duration: 10,
        reason: "Breathing exercises are a great foundation for any recovery day.",
        message: "Your inner flame still burns bright. Take a moment to breathe and center yourself today.",
        insight: "Consistent practice builds stronger neural pathways over time.",
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Helper function to analyze domain strengths and weaknesses
function analyzeDomains(context: UserContext): string {
  const analysis: string[] = [];
  
  // Check module balance
  const moduleTypes = Object.keys(context.moduleStats);
  if (moduleTypes.length === 0) {
    return "User is new - no domain data yet. Recommend starting with breathing for foundation.";
  }

  // Find most and least practiced
  let mostPracticed = { module: '', sessions: 0 };
  let leastPracticed = { module: '', sessions: Infinity };
  
  for (const [mod, stats] of Object.entries(context.moduleStats)) {
    if (stats.sessions > mostPracticed.sessions) {
      mostPracticed = { module: mod, sessions: stats.sessions };
    }
    if (stats.sessions < leastPracticed.sessions) {
      leastPracticed = { module: mod, sessions: stats.sessions };
    }
  }

  analysis.push(`Most practiced: ${mostPracticed.module} (${mostPracticed.sessions} sessions)`);
  
  // Check for neglected modules
  const allModules = ['breathing', 'mind', 'gratitude', 'cold-exposure', 'incog'];
  const neglected = allModules.filter(m => !moduleTypes.includes(m));
  if (neglected.length > 0) {
    analysis.push(`Never tried: ${neglected.join(', ')}`);
  }

  // Check clinical assessment trends
  if (context.clinicalAssessments.length >= 2) {
    const byType: Record<string, number[]> = {};
    for (const a of context.clinicalAssessments) {
      if (!byType[a.assessment_type]) byType[a.assessment_type] = [];
      if (a.score !== null) byType[a.assessment_type].push(a.score);
    }
    
    for (const [type, scores] of Object.entries(byType)) {
      if (scores.length >= 2) {
        const trend = scores[0] > scores[scores.length - 1] ? 'improving' : 
                     scores[0] < scores[scores.length - 1] ? 'needs attention' : 'stable';
        analysis.push(`${type}: ${trend} (latest: ${scores[0]})`);
      }
    }
  }

  // Check mood trends
  if (context.recentCheckins.length >= 3) {
    const moods = context.recentCheckins.filter(c => c.mood !== null).map(c => c.mood!);
    if (moods.length >= 3) {
      const avgMood = moods.reduce((a, b) => a + b, 0) / moods.length;
      if (avgMood < 2.5) {
        analysis.push("Mood trend: Low - prioritize uplifting activities (gratitude, breathing)");
      } else if (avgMood > 3.5) {
        analysis.push("Mood trend: Good - consider challenging cognitive exercises");
      }
    }
  }

  return analysis.join('\n') || "Insufficient data for detailed analysis";
}
