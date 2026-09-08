// Curated subset of models hosted by Berget AI (https://api.berget.ai), an
// OpenAI-compatible inference API. `modelId` must match a model `id` (or
// alias) from Berget's `/v1/models` endpoint. All four support native
// function/tool calling AND a custom system prompt at the same time.
export const MODEL_OPTIONS = [
  {
    modelId: "mistralai/Mistral-Small-3.2-24B-Instruct-2506",
    label: "Mistral Small 3.2",
    size: "24B params",
    note: "Fast and cheap (€0.30 / M tokens). Good default for a live demo.",
    supportsTools: true,
  },
  {
    modelId: "google/gemma-4-31B-it",
    label: "Gemma 4",
    size: "31B params",
    note: "Google's Gemma 4, instruction-tuned. Supports vision as well as tools.",
    supportsTools: true,
  },
  {
    modelId: "zai-org/GLM-5.3-Flash",
    label: "GLM-5.3 Flash",
    size: "320B params (MoE)",
    note: "Large mixture-of-experts model from Zhipu AI, tuned for speed.",
    supportsTools: true,
  },
  {
    modelId: "moonshotai/Kimi-K3",
    label: "Kimi K3",
    size: "2.8T params (MoE)",
    note: "Moonshot AI's largest model. Slower and pricier, but very capable.",
    supportsTools: true,
  },
];

export const DEFAULT_MODEL_ID = MODEL_OPTIONS[0].modelId;

export const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful, concise assistant used in a live workshop demo.";
