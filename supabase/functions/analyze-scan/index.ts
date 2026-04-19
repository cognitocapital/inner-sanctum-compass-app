// Analyse an uploaded scan image and/or radiology report and return likely
// affected brain regions, mapped strictly to our atlas region IDs.
// Educational only — never diagnostic. The UI must surface the disclaimer.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Mirror of region IDs from src/data/brainRegions.ts.
// Keep in sync — the model is constrained to pick from this exact list.
const ALLOWED_REGION_IDS = [
  // cortical
  "dlpfc", "vlpfc", "ofc", "mpfc", "acc", "dacc",
  "broca", "wernicke", "motor", "somatosensory",
  "ips", "tpj", "angular", "precuneus", "pcc",
  "v1", "v4", "mt", "fusiform",
  "insula_l", "insula_r",
  "temporal_pole", "stg", "mtg", "itg",
  // subcortical
  "hippocampus_l", "hippocampus_r",
  "amygdala_l", "amygdala_r",
  "thalamus_l", "thalamus_r",
  "caudate", "putamen", "globus_pallidus",
  "nucleus_accumbens", "substantia_nigra",
  "fornix", "corpus_callosum_genu", "corpus_callosum_splenium", "uncinate",
  // brainstem & cerebellum
  "midbrain", "pons", "medulla",
  "locus_coeruleus", "raphe", "pag",
  "vestibular_nuclei",
  "cerebellum_vermis", "cerebellum_flocculus", "cerebellum_posterior",
  // networks
  "dmn", "salience_network", "executive_network",
];

const SYSTEM_PROMPT = `You are a clinical neuroanatomy assistant helping a TBI survivor cross-reference their imaging or radiology report with an educational brain atlas.

You will be given EITHER:
- a brain scan image (CT/MRI slice — could be axial, coronal, or sagittal),
- a radiology report text,
- or both.

Your job: identify which brain regions are most likely affected, mapped to our fixed atlas IDs.

CRITICAL RULES:
1. Only return region IDs from the allowed list. Never invent IDs.
2. If the input is unclear, ambiguous, or you genuinely cannot tell, return an empty regions array and explain in the summary.
3. NEVER diagnose. Frame everything as "areas to discuss with your neurologist".
4. Confidence must be honest: 'low' for educational guesses, 'high' only when the report explicitly names a structure.
5. Severity should reflect what's described/visible, not your assumption. Use 'unknown' if not stated.
6. Maximum 8 regions returned — pick the most relevant.
7. Always include a short, plain-English summary the user can take to their clinician.`;

async function callLovableAI(messages: any[], tools: any[]) {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      tools,
      tool_choice: { type: "function", function: { name: "report_affected_regions" } },
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    if (resp.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    if (resp.status === 402) {
      throw new Error("PAYMENT_REQUIRED");
    }
    throw new Error(`AI gateway ${resp.status}: ${text}`);
  }

  return await resp.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { imageBase64, imageMimeType, reportText, fileName } = body || {};

    if (!imageBase64 && !reportText) {
      return new Response(
        JSON.stringify({ error: "Provide an image (imageBase64) or reportText." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Build user message — multimodal if image present
    const userContent: any[] = [];
    const intro = `Please analyse this ${imageBase64 ? "brain scan" : "radiology report"}${
      fileName ? ` (file: ${fileName})` : ""
    } and identify likely affected regions from the allowed atlas.`;
    userContent.push({ type: "text", text: intro });

    if (reportText) {
      userContent.push({
        type: "text",
        text: `\n\nReport text:\n"""\n${String(reportText).slice(0, 8000)}\n"""`,
      });
    }
    if (imageBase64) {
      const mime = imageMimeType || "image/jpeg";
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${mime};base64,${imageBase64}` },
      });
    }

    const tools = [
      {
        type: "function",
        function: {
          name: "report_affected_regions",
          description: "Return likely affected brain regions for educational review.",
          parameters: {
            type: "object",
            properties: {
              regions: {
                type: "array",
                description: "Up to 8 affected regions. Empty array if nothing identifiable.",
                items: {
                  type: "object",
                  properties: {
                    regionId: {
                      type: "string",
                      enum: ALLOWED_REGION_IDS,
                      description: "Atlas region ID. MUST be from the allowed list.",
                    },
                    severity: {
                      type: "string",
                      enum: ["mild", "moderate", "severe", "unknown"],
                    },
                    confidence: {
                      type: "string",
                      enum: ["low", "medium", "high"],
                    },
                    rationale: {
                      type: "string",
                      description: "One short sentence (<25 words) on why this region was flagged.",
                    },
                  },
                  required: ["regionId", "severity", "confidence", "rationale"],
                  additionalProperties: false,
                },
              },
              summary: {
                type: "string",
                description: "Plain-English overview to share with a clinician (1-3 sentences).",
              },
              clinicianQuestions: {
                type: "array",
                items: { type: "string" },
                description: "2-3 questions the user could ask their neurologist.",
              },
            },
            required: ["regions", "summary", "clinicianQuestions"],
            additionalProperties: false,
          },
        },
      },
    ];

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ];

    const ai = await callLovableAI(messages, tools);
    const toolCall = ai?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(
        JSON.stringify({
          regions: [],
          summary: "The AI couldn't structure a response. Please try again or paste the report text directly.",
          clinicianQuestions: [],
          disclaimer: "Educational only — not diagnostic.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let parsed: any;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      parsed = { regions: [], summary: "Could not parse AI response.", clinicianQuestions: [] };
    }

    // Defensive filter: drop any region IDs that slipped past the enum.
    const cleanRegions = (parsed.regions || []).filter((r: any) =>
      ALLOWED_REGION_IDS.includes(r.regionId),
    );

    return new Response(
      JSON.stringify({
        regions: cleanRegions,
        summary: parsed.summary || "",
        clinicianQuestions: parsed.clinicianQuestions || [],
        disclaimer:
          "Educational AI suggestion only — not a diagnosis. Always review imaging with your neurologist.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("analyze-scan error:", err);
    const msg = err?.message || "Unknown error";
    if (msg === "RATE_LIMIT") {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (msg === "PAYMENT_REQUIRED") {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
