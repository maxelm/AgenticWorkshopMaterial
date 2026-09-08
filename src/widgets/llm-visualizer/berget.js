// Thin client for Berget AI's OpenAI-compatible inference API
// (https://api.berget.ai). Used instead of an in-browser WebLLM model so we
// can pick from larger, hosted open-source models — including ones that
// support both tool calling AND a custom system prompt at the same time.

const BERGET_CHAT_COMPLETIONS_URL = "https://api.berget.ai/v1/chat/completions";

export function readBergetApiKey() {
  const key = import.meta.env.BERGET_API_KEY;
  return key && key.length > 0 ? key : null;
}

/**
 * Sends a minimal, cheap request (max_tokens: 1, no streaming) to confirm the
 * API key is valid and the model is reachable, without generating a real
 * response. Throws with a readable message on failure.
 */
export async function verifyBergetModel({ apiKey, model, signal }) {
  const res = await fetch(BERGET_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 1,
      stream: false,
    }),
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Berget API error ${res.status}: ${text.slice(0, 300)}`);
  }
  return true;
}

/**
 * Merges one streaming chunk's `delta.tool_calls` fragments into an
 * index-keyed accumulator. Standard OpenAI-style streaming sends tool calls
 * incrementally: the first chunk for a given call carries `id`/`function.name`,
 * and every chunk (including the first) may carry a fragment of
 * `function.arguments` that must be concatenated in order.
 */
export function mergeToolCallDeltas(accumulator, deltas) {
  for (const d of deltas) {
    const idx = d.index ?? 0;
    if (!accumulator[idx]) {
      accumulator[idx] = { id: d.id, name: d.function?.name, arguments: "" };
    }
    if (d.id) accumulator[idx].id = d.id;
    if (d.function?.name) accumulator[idx].name = d.function.name;
    if (d.function?.arguments) accumulator[idx].arguments += d.function.arguments;
  }
}

/**
 * Streams a chat completion from Berget AI, yielding each parsed SSE chunk
 * (already-parsed JSON objects, same shape as the OpenAI streaming API:
 * `{ choices: [{ delta, finish_reason }], usage? }`).
 */
export async function* streamBergetChatCompletion({
  apiKey,
  model,
  messages,
  tools,
  signal,
}) {
  const res = await fetch(BERGET_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      tools: tools && tools.length ? tools : undefined,
      stream: true,
      stream_options: { include_usage: true },
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`Berget API error ${res.status}: ${text.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        yield JSON.parse(data);
      } catch {
        // Ignore malformed/partial SSE lines.
      }
    }
  }
}
