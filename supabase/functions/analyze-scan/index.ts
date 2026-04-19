// Multi-input scan + report analyser. Accepts arrays of images and/or report
// snippets and synthesises a holistic list of likely affected regions.
// Educational only — never diagnostic.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

const MAX_IMAGES = 6;
const MAX_REPORTS = 6;
const MAX_REPORT_CHARS = 8000;

const SYSTEM_PROMPT = `You are a clinical neuroanatomy assistant helping a TBI survivor cross-reference MULTIPLE pieces of imaging and/or radiology reports against an educational brain atlas.

You may receive several scan images (different slices, modalities, or timepoints) AND/OR several radiology report snippets. Synthesise them into ONE holistic list of likely affected regions — do NOT repeat the same region per input. Combine evidence: e.g. if two reports mention the right hippocampus, merge into a single high-confidence entry.

CRITICAL RULES:
1. Only return region IDs from the allowed list. Never invent IDs.
2. Maximum 10 regions in the final synthesised list.
3. Confidence reflects combined evidence: 'high' only when explicitly named in a report or clearly visible across multiple inputs.
4. Severity reflects what's described/visible. Use 'unknown' if not stated.
5. NEVER diagnose. Frame as "areas to discuss with your neurologist".
6. Summary should mention how many inputs were considered and any agreement/disagreement between them.
7. If inputs are unclear or unrelated to brain anatomy, return an empty regions array and explain in the summary.`;

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
    if (resp.status === 429) throw new Error("RATE_LIMIT");
    if (resp.status === 402) throw new Error("PAYMENT_REQUIRED");
    throw new Error(`AI gateway ${resp.status}: ${text}`);
  }
  return await resp.json();
}

interface InputImage { base64: string; mimeType?: string; fileName?: string }
interface InputReport { text: string; label?: string }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));

    // Backwards compatibility: accept old single-input shape too.
    let images: InputImage[] = Array.isArray(body.images) ? body.images : [];
    let reports: InputReport[] = Array.isArray(body.reports) ? body.reports : [];

    if (body.imageBase64) {
      images.push({
        base64: body.imageBase64,
        mimeType: body.imageMimeType,
        fileName: body.fileName,
      });
    }
    if (body.reportText) {
      reports.push({ text: body.reportText });
    }

    images = images.slice(0, MAX_IMAGES);
    reports = reports.slice(0, MAX_REPORTS);

    if (images.length === 0 && reports.length === 0) {
      return new Response(
        JSON.stringify({ error: "Provide at least one image or report." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userContent: any[] = [];
    userContent.push({
      type: "text",
      text: `Synthesise these ${images.length} scan image(s) and ${reports.length} report snippet(s) into one holistic list of likely affected regions from the allowed atlas.`,
    });

    reports.forEach((r, i) => {
      userContent.push({
        type: "text",
        text: `\n--- Report ${i + 1}${r.label ? ` (${r.label})` : ""} ---\n${String(r.text).slice(0, MAX_REPORT_CHARS)}`,
      });
    });

    images.forEach((img, i) => {
      userContent.push({ type: "text", text: `\n--- Image ${i + 1}${img.fileName ? ` (${img.fileName})` : ""} ---` });
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${img.mimeType || "image/jpeg"};base64,${img.base64}` },
      });
    });

    const tools = [
      {
        type: "function",
        function: {
          name: "report_affected_regions",
          description: "Return a synthesised list of likely affected brain regions across all inputs.",
          parameters: {
            type: "object",
            properties: {
              regions: {
                type: "array",
                description: "Up to 10 regions. Merged across inputs — no duplicates.",
                items: {
                  type: "object",
                  properties: {
                    regionId: { type: "string", enum: ALLOWED_REGION_IDS },
                    severity: { type: "string", enum: ["mild", "moderate", "severe", "unknown"] },
                    confidence: { type: "string", enum: ["low", "medium", "high"] },
                    rationale: {
                      type: "string",
                      description: "One short sentence (<30 words) referencing which input(s) supported this.",
                    },
                  },
                  required: ["regionId", "severity", "confidence", "rationale"],
                  additionalProperties: false,
                },
              },
              summary: {
                type: "string",
                description: "Plain-English overview (1-3 sentences) noting how inputs agreed/disagreed.",
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
          summary: "The AI couldn't structure a response. Please try again.",
          clinicianQuestions: [],
          disclaimer: "Educational only — not diagnostic.",
          inputCounts: { images: images.length, reports: reports.length },
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

    const cleanRegions = (parsed.regions || []).filter((r: any) =>
      ALLOWED_REGION_IDS.includes(r.regionId),
    );

    return new Response(
      JSON.stringify({
        regions: cleanRegions,
        summary: parsed.summary || "",
        clinicianQuestions: parsed.clinicianQuestions || [],
        disclaimer: "Educational AI suggestion only — not a diagnosis. Always review imaging with your neurologist.",
        inputCounts: { images: images.length, reports: reports.length },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("analyze-scan error:", err);
    const msg = err?.message || "Unknown error";
    if (msg === "RATE_LIMIT") {
      return new Response(JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (msg === "PAYMENT_REQUIRED") {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
