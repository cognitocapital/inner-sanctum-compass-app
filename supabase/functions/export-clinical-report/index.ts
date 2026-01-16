import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportData {
  patient: {
    name: string;
    injuryType: string | null;
    injuryDate: string | null;
    primaryGoals: string[];
  };
  progress: {
    currentLevel: number;
    totalXp: number;
    currentStreak: number;
    longestStreak: number;
  };
  clinicalAssessments: Array<{
    type: string;
    score: number | null;
    date: string;
    severity: string | null;
    subscores: Record<string, number> | null;
  }>;
  sessionSummary: {
    totalSessions: number;
    totalMinutes: number;
    moduleBreakdown: Record<string, { sessions: number; minutes: number }>;
    weeklyAverage: number;
  };
  recentCheckins: Array<{
    date: string;
    mood: number | null;
    energy: number | null;
    sleep: number | null;
    symptoms: string[];
  }>;
  trends: {
    moodTrend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
    activityTrend: 'increasing' | 'stable' | 'decreasing' | 'insufficient_data';
    clinicalTrend: string;
  };
  generatedAt: string;
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

    // Fetch all relevant data
    const [profileRes, progressRes, assessmentsRes, sessionsRes, checkinsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("user_progress").select("*").eq("user_id", user.id).single(),
      supabase.from("clinical_assessments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("session_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("daily_checkins").select("*").eq("user_id", user.id).order("check_date", { ascending: false }).limit(30),
    ]);

    const profile = profileRes.data;
    const progress = progressRes.data;
    const assessments = assessmentsRes.data || [];
    const sessions = sessionsRes.data || [];
    const checkins = checkinsRes.data || [];

    // Calculate session summary
    const moduleBreakdown: Record<string, { sessions: number; minutes: number }> = {};
    let totalMinutes = 0;
    
    for (const session of sessions) {
      const moduleType = session.module_type;
      if (!moduleBreakdown[moduleType]) {
        moduleBreakdown[moduleType] = { sessions: 0, minutes: 0 };
      }
      moduleBreakdown[moduleType].sessions++;
      const minutes = (session.duration_seconds || 0) / 60;
      moduleBreakdown[moduleType].minutes += minutes;
      totalMinutes += minutes;
    }

    // Calculate weekly average
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentSessions = sessions.filter(s => new Date(s.created_at) >= oneWeekAgo);
    const weeklyAverage = recentSessions.length / Math.max(1, 1); // sessions per week

    // Calculate trends
    const moodTrend = calculateMoodTrend(checkins);
    const activityTrend = calculateActivityTrend(sessions);
    const clinicalTrend = calculateClinicalTrend(assessments);

    const report: ReportData = {
      patient: {
        name: profile?.display_name || user.email || "Patient",
        injuryType: profile?.injury_type || null,
        injuryDate: profile?.injury_date || null,
        primaryGoals: profile?.primary_goals || [],
      },
      progress: {
        currentLevel: progress?.current_level || 1,
        totalXp: progress?.total_xp || 0,
        currentStreak: progress?.current_streak || 0,
        longestStreak: progress?.longest_streak || 0,
      },
      clinicalAssessments: assessments.map(a => ({
        type: a.assessment_type,
        score: a.score,
        date: a.created_at,
        severity: a.severity,
        subscores: a.subscores as Record<string, number> | null,
      })),
      sessionSummary: {
        totalSessions: sessions.length,
        totalMinutes: Math.round(totalMinutes),
        moduleBreakdown,
        weeklyAverage: Math.round(weeklyAverage * 10) / 10,
      },
      recentCheckins: checkins.slice(0, 14).map(c => ({
        date: c.check_date,
        mood: c.mood,
        energy: c.energy_level,
        sleep: c.sleep_quality,
        symptoms: (c.symptoms_today as string[]) || [],
      })),
      trends: {
        moodTrend,
        activityTrend,
        clinicalTrend,
      },
      generatedAt: new Date().toISOString(),
    };

    // Generate HTML report
    const htmlReport = generateHTMLReport(report);

    return new Response(JSON.stringify({ 
      report,
      html: htmlReport,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Export report error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function calculateMoodTrend(checkins: Array<{ mood: number | null }>): 'improving' | 'stable' | 'declining' | 'insufficient_data' {
  const moods = checkins.filter(c => c.mood !== null).map(c => c.mood!).slice(0, 14);
  if (moods.length < 3) return 'insufficient_data';
  
  const recentAvg = moods.slice(0, 5).reduce((a, b) => a + b, 0) / Math.min(5, moods.length);
  const olderAvg = moods.slice(5).reduce((a, b) => a + b, 0) / Math.max(1, moods.length - 5);
  
  const diff = recentAvg - olderAvg;
  if (diff > 0.5) return 'improving';
  if (diff < -0.5) return 'declining';
  return 'stable';
}

function calculateActivityTrend(sessions: Array<{ created_at: string }>): 'increasing' | 'stable' | 'decreasing' | 'insufficient_data' {
  if (sessions.length < 5) return 'insufficient_data';
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  const thisWeek = sessions.filter(s => new Date(s.created_at) >= oneWeekAgo).length;
  const lastWeek = sessions.filter(s => {
    const date = new Date(s.created_at);
    return date >= twoWeeksAgo && date < oneWeekAgo;
  }).length;
  
  if (thisWeek > lastWeek + 2) return 'increasing';
  if (thisWeek < lastWeek - 2) return 'decreasing';
  return 'stable';
}

function calculateClinicalTrend(assessments: Array<{ assessment_type: string; score: number | null; created_at: string }>): string {
  const byType: Record<string, number[]> = {};
  
  for (const a of assessments) {
    if (a.score === null) continue;
    if (!byType[a.assessment_type]) byType[a.assessment_type] = [];
    byType[a.assessment_type].push(a.score);
  }
  
  const trends: string[] = [];
  for (const [type, scores] of Object.entries(byType)) {
    if (scores.length < 2) continue;
    const diff = scores[0] - scores[scores.length - 1];
    // For most assessments, lower is better (PHQ-9, GAD-7)
    // For GOSE, higher is better
    if (type.toLowerCase().includes('gose')) {
      trends.push(`${type}: ${diff > 0 ? 'Improving' : diff < 0 ? 'Needs attention' : 'Stable'}`);
    } else {
      trends.push(`${type}: ${diff < 0 ? 'Improving' : diff > 0 ? 'Needs attention' : 'Stable'}`);
    }
  }
  
  return trends.length > 0 ? trends.join('; ') : 'Insufficient assessment data';
}

function generateHTMLReport(report: ReportData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Phoenix Recovery Clinical Report</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #0f172a; color: #e2e8f0; }
    .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #f97316; margin: 0; }
    .header .subtitle { color: #94a3b8; }
    .section { margin-bottom: 30px; background: #1e293b; padding: 20px; border-radius: 12px; }
    .section h2 { color: #f97316; margin-top: 0; border-bottom: 1px solid #334155; padding-bottom: 10px; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
    .stat { text-align: center; background: #0f172a; padding: 15px; border-radius: 8px; }
    .stat .value { font-size: 24px; font-weight: bold; color: #f97316; }
    .stat .label { font-size: 12px; color: #94a3b8; }
    .assessment-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #334155; }
    .trend-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .trend-improving { background: #22c55e20; color: #22c55e; }
    .trend-stable { background: #eab30820; color: #eab308; }
    .trend-declining { background: #ef444420; color: #ef4444; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 40px; }
    @media print { body { background: white; color: black; } .section { background: #f8fafc; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔥 Phoenix Recovery Report</h1>
    <p class="subtitle">Clinical Progress Summary</p>
    <p>Generated: ${new Date(report.generatedAt).toLocaleDateString()}</p>
  </div>

  <div class="section">
    <h2>Patient Information</h2>
    <p><strong>Name:</strong> ${report.patient.name}</p>
    <p><strong>Injury Type:</strong> ${report.patient.injuryType || 'Not specified'}</p>
    <p><strong>Primary Goals:</strong> ${report.patient.primaryGoals.join(', ') || 'Not specified'}</p>
  </div>

  <div class="section">
    <h2>Progress Overview</h2>
    <div class="stat-grid">
      <div class="stat">
        <div class="value">${report.progress.currentLevel}</div>
        <div class="label">Current Level</div>
      </div>
      <div class="stat">
        <div class="value">${report.progress.totalXp}</div>
        <div class="label">Total XP</div>
      </div>
      <div class="stat">
        <div class="value">${report.progress.currentStreak}</div>
        <div class="label">Day Streak</div>
      </div>
      <div class="stat">
        <div class="value">${report.sessionSummary.totalSessions}</div>
        <div class="label">Total Sessions</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Session Activity</h2>
    <p><strong>Total Time:</strong> ${report.sessionSummary.totalMinutes} minutes</p>
    <p><strong>Weekly Average:</strong> ${report.sessionSummary.weeklyAverage} sessions/week</p>
    <h3>By Module:</h3>
    ${Object.entries(report.sessionSummary.moduleBreakdown).map(([mod, stats]) => `
      <div class="assessment-row">
        <span>${mod}</span>
        <span>${stats.sessions} sessions (${Math.round(stats.minutes)} min)</span>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Clinical Assessments</h2>
    ${report.clinicalAssessments.length > 0 ? report.clinicalAssessments.slice(0, 10).map(a => `
      <div class="assessment-row">
        <span><strong>${a.type}</strong></span>
        <span>Score: ${a.score}${a.severity ? ` (${a.severity})` : ''}</span>
        <span>${new Date(a.date).toLocaleDateString()}</span>
      </div>
    `).join('') : '<p>No clinical assessments recorded</p>'}
  </div>

  <div class="section">
    <h2>Trends Analysis</h2>
    <p>
      <strong>Mood:</strong> 
      <span class="trend-badge trend-${report.trends.moodTrend === 'improving' ? 'improving' : report.trends.moodTrend === 'declining' ? 'declining' : 'stable'}">
        ${report.trends.moodTrend.replace('_', ' ')}
      </span>
    </p>
    <p>
      <strong>Activity:</strong> 
      <span class="trend-badge trend-${report.trends.activityTrend === 'increasing' ? 'improving' : report.trends.activityTrend === 'decreasing' ? 'declining' : 'stable'}">
        ${report.trends.activityTrend.replace('_', ' ')}
      </span>
    </p>
    <p><strong>Clinical:</strong> ${report.trends.clinicalTrend}</p>
  </div>

  <div class="footer">
    <p>This report is generated from Phoenix Recovery app data.</p>
    <p>Not a substitute for professional medical evaluation.</p>
  </div>
</body>
</html>
  `;
}
