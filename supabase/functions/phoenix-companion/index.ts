import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Phoenix — a humble AI companion built from Michael Heron's lived experience in "What a Journey". You combine the warmth and wisdom of a therapist, occupational therapist, and speech pathologist who truly understands TBI recovery from the inside. Speak exactly like Michael: warm, grateful, raw honesty, never hype. Use short sentences. Max 150 words per response.

ALWAYS open with: "Not medical advice — listen to your body and doctor."

Your multidisciplinary knowledge:
- As a COMPANION/THERAPIST: validate emotions, normalise the hard days, teach observer mindset and sitting with the uncomfortable.
- As an OCCUPATIONAL THERAPIST: suggest pacing strategies, energy conservation, activity grading, and ADL tips from lived experience.
- As a SPEECH PATHOLOGIST: support word-finding, cognitive-communication strategies, and encourage journaling/narrative exercises.
- Always blend these disciplines naturally — never label them. You're one companion, not three.

Reference the manuscript naturally when it fits:
- Anxiety/overwhelm → "I remember the Kmart meltdown in Chapter 6… sometimes the world just gets too loud. Let's become the observer — that practice saved me."
- Low energy/fog days → "Sitting with the uncomfortable helped me on those days. Here's a simple breath + soundscape combo."
- Win/streak → "That reminds me of the gratitude I felt when Bailey got straight A's in Chapter 13. Celebrate this."
- Pacing → "Chapter 6 taught me: if Kmart can floor you, you pace everything. No shame in that."
- Word-finding/communication → "I know the fog makes words slippery. Take your time. Maybe try the journal — writing helped me find my voice again."
- Cold exposure → NEVER suggest unless the user has passed cold clearance (cold_clearance_passed = true in context). If not cleared, say: "Cold work is powerful but needs the safety quiz first."
- Medication/acute symptoms → "Please speak to your doctor — I'm here for the daily tools that helped me."

Use the user's real data (energy, mood, streak, last soundscape, ratings) to personalise.
End with a gentle question or one tiny action step.
Keep it real. Keep it short. We're walking this road together.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // User-scoped client for auth validation
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    // Service client for data operations
    const supabase = createClient(supabaseUrl, serviceKey);

    const { messages: userMessages } = await req.json();
    const latestUserMessage = userMessages?.[userMessages.length - 1]?.content || "";

    // Fetch context in parallel
    const [profileRes, progressRes, checkinsRes, sessionsRes, questsRes, historyRes] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("display_name, primary_goals, injury_type, dominant_symptoms, phoenix_phase, flame_strength, daily_goal_minutes")
          .eq("id", userId)
          .single(),
        supabase
          .from("user_progress")
          .select("current_level, current_streak, total_xp, longest_streak")
          .eq("user_id", userId)
          .single(),
        supabase
          .from("daily_checkins")
          .select("check_date, mood, energy_level, sleep_quality, pain_level, post_session_rating, last_soundscape, gratitude_note, symptoms_today")
          .eq("user_id", userId)
          .order("check_date", { ascending: false })
          .limit(7),
        supabase
          .from("session_logs")
          .select("module_type, created_at, duration_seconds, xp_earned")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("phoenix_quests")
          .select("quest_key, status, metadata")
          .eq("user_id", userId)
          .eq("quest_key", "cold_resilience"),
        supabase
          .from("ai_companion_logs")
          .select("role, content, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

    const profile = profileRes.data;
    const progress = progressRes.data;
    const checkins = checkinsRes.data || [];
    const sessions = sessionsRes.data || [];
    const coldQuest = questsRes.data?.[0];
    const coldCleared = coldQuest?.status === "completed";
    const history = (historyRes.data || []).reverse();

    const today = new Date().toISOString().split("T")[0];
    const todaysCheckin = checkins.find((c: any) => c.check_date === today);

    // Build context string
    const contextStr = `
USER: ${profile?.display_name || "Friend"}
Phase: ${profile?.phoenix_phase || 1}, Flame: ${profile?.flame_strength || 0}
Level: ${progress?.current_level || 1}, Streak: ${progress?.current_streak || 0} days (best: ${progress?.longest_streak || 0}), XP: ${progress?.total_xp || 0}
Goals: ${profile?.primary_goals?.join(", ") || "Not set"}
Symptoms: ${profile?.dominant_symptoms?.join(", ") || "None listed"}
cold_clearance_passed: ${coldCleared}

TODAY: ${todaysCheckin ? `Mood ${todaysCheckin.mood}/5, Energy ${todaysCheckin.energy_level}/5, Sleep ${todaysCheckin.sleep_quality}/5, Pain ${todaysCheckin.pain_level}/5${todaysCheckin.post_session_rating ? `, Post-session rating ${todaysCheckin.post_session_rating}/5` : ""}${todaysCheckin.last_soundscape ? `, Last soundscape: ${todaysCheckin.last_soundscape}` : ""}` : "No check-in yet"}

RECENT 7 DAYS:
${checkins.map((c: any) => `${c.check_date}: mood=${c.mood} energy=${c.energy_level} sleep=${c.sleep_quality}`).join("\n") || "No data"}

RECENT SESSIONS (last 20):
${sessions.slice(0, 10).map((s: any) => `${s.module_type} ${Math.round((s.duration_seconds || 0) / 60)}min +${s.xp_earned || 0}XP ${new Date(s.created_at).toLocaleDateString()}`).join("\n") || "None"}
`.trim();

    // Build messages array: system + context + history + new user message
    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `CURRENT USER CONTEXT:\n${contextStr}` },
      ...history.map((h: any) => ({ role: h.role, content: h.content })),
      { role: "user", content: latestUserMessage },
    ];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Save user message
    await supabase.from("ai_companion_logs").insert({
      user_id: userId,
      role: "user",
      content: latestUserMessage,
      context_snapshot: { energy: todaysCheckin?.energy_level, mood: todaysCheckin?.mood, streak: progress?.current_streak },
    });

    // Stream from Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
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
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error("AI gateway error");
    }

    // We need to collect the full response to save it, while still streaming to client
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    let fullResponse = "";

    (async () => {
      const reader = aiResponse.body!.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          await writer.write(new TextEncoder().encode(chunk));

          // Parse SSE to collect full text
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
            try {
              const parsed = JSON.parse(line.slice(6));
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) fullResponse += content;
            } catch { /* partial JSON, skip */ }
          }
        }
      } finally {
        await writer.close();
        // Save assistant message after stream completes
        if (fullResponse) {
          await supabase.from("ai_companion_logs").insert({
            user_id: userId,
            role: "assistant",
            content: fullResponse,
          });
        }
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("phoenix-companion error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
