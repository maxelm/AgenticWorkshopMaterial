import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_MODEL_ID,
  DEFAULT_SYSTEM_PROMPT,
  MODEL_OPTIONS,
} from "./models.js";
import {
  TOOL_DEFINITIONS,
  getToolDefinition,
  primeLocationPermission,
} from "./tools.js";
import {
  mergeToolCallDeltas,
  readBergetApiKey,
  streamBergetChatCompletion,
  verifyBergetModel,
} from "./berget.js";
import "./LlmVisualizerWidget.css";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return idCounter;
}

function roleLabel(role) {
  switch (role) {
    case "system":
      return "System";
    case "tools":
      return "Tools";
    case "user":
      return "User";
    case "assistant":
      return "Assistant";
    case "tool":
      return "Tool result";
    default:
      return role;
  }
}

/** A collapsible section with a header summary shown while collapsed. */
function CollapsibleSection({ title, summary, collapsed, onToggleCollapsed, children }) {
  return (
    <section className="llm-viz__section">
      <button
        type="button"
        className="llm-viz__collapse-header"
        onClick={onToggleCollapsed}
        aria-expanded={!collapsed}
      >
        <span className="llm-viz__collapse-chevron">{collapsed ? "▸" : "▾"}</span>
        <span className="llm-viz__collapse-title">{title}</span>
        {collapsed && summary && (
          <span className="llm-viz__collapse-summary">{summary}</span>
        )}
      </button>
      {!collapsed && <div className="llm-viz__collapse-body">{children}</div>}
    </section>
  );
}

/** Renders a JSON value as a recursively foldable tree using native <details>. */
function JsonValue({ value }) {
  if (value === null) return <span className="json-null">null</span>;
  if (Array.isArray(value)) return <JsonContainer value={value} isArray />;
  if (typeof value === "object") return <JsonContainer value={value} isArray={false} />;
  if (typeof value === "string")
    return <span className="json-string">"{value}"</span>;
  if (typeof value === "number") return <span className="json-number">{value}</span>;
  if (typeof value === "boolean")
    return <span className="json-boolean">{String(value)}</span>;
  return <span>{String(value)}</span>;
}

function JsonContainer({ value, isArray }) {
  const entries = isArray
    ? value.map((v, i) => [i, v])
    : Object.entries(value);
  const openBrace = isArray ? "[" : "{";
  const closeBrace = isArray ? "]" : "}";

  if (entries.length === 0) {
    return (
      <span className="json-punct">
        {openBrace}
        {closeBrace}
      </span>
    );
  }

  return (
    <details className="json-node" open>
      <summary>
        <span className="json-punct">{openBrace}</span>
        <span className="json-meta">
          {entries.length} {isArray ? "item" : "key"}
          {entries.length === 1 ? "" : "s"}
        </span>
      </summary>
      <div className="json-indent">
        {entries.map(([key, val]) => (
          <div key={key} className="json-row">
            {!isArray && <span className="json-key">"{key}"</span>}
            {!isArray && <span className="json-punct">: </span>}
            <JsonValue value={val} />
          </div>
        ))}
      </div>
      <span className="json-punct">{closeBrace}</span>
    </details>
  );
}

function finishReasonInfo(reason) {
  switch (reason) {
    case "stop":
      return { label: "stop token", className: "stop-chip--stop", icon: "⏹" };
    case "length":
      return { label: "max tokens reached", className: "stop-chip--length", icon: "⏹" };
    case "tool_calls":
      return { label: "tool call", className: "stop-chip--tool", icon: "⏹" };
    case "abort":
      return { label: "aborted by user", className: "stop-chip--abort", icon: "⏹" };
    default:
      return null;
  }
}

/** A small badge shown at the end of generated text marking why/how generation stopped. */
function StopTokenChip({ reason }) {
  const info = finishReasonInfo(reason);
  if (!info) return null;
  return (
    <span className={`stop-chip ${info.className}`} title={`finish_reason: ${reason}`}>
      {info.icon} {info.label}
    </span>
  );
}

/** One block in the context view: a role-tagged chunk of the prompt. */
function ContextBlock({
  role,
  isNew,
  isStreaming,
  children,
  statsText,
  finishReason,
  toolName,
}) {
  return (
    <div
      className={`ctx-block ctx-block--${role} ${
        isNew ? "ctx-block--new" : "ctx-block--reused"
      }`}
    >
      <div className="ctx-block__header">
        <span className="ctx-block__role">
          {roleLabel(role)}
          {toolName && <code className="ctx-block__tool-name"> · {toolName}</code>}
        </span>
        <span className="ctx-block__tag">
          {isStreaming ? "generating…" : isNew ? "new this turn" : "already sent"}
        </span>
      </div>
      <div className="ctx-block__body">
        {children}
        {finishReason && <StopTokenChip reason={finishReason} />}
        {isStreaming && <span className="ctx-block__cursor">▌</span>}
      </div>
      {statsText && <div className="ctx-block__stats">{statsText}</div>}
    </div>
  );
}

/** Compact rendering of the model's tool_calls, shown inside an assistant block. */
function ToolCallList({ toolCalls }) {
  return (
    <div className="ctx-block__tool-calls">
      {toolCalls.map((tc) => (
        <div key={tc.id} className="ctx-block__tool-call">
          🛠️ <code>{tc.name}</code>
          <code className="ctx-block__tool-args">({tc.arguments || "{}"})</code>
        </div>
      ))}
    </div>
  );
}

export default function LlmVisualizerWidget() {
  const apiKey = readBergetApiKey();

  const abortControllerRef = useRef(null);
  const scrollAnchorRef = useRef(null);

  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [engineStatus, setEngineStatus] = useState("unloaded"); // unloaded | loading | ready | error
  const [errorMessage, setErrorMessage] = useState(null);

  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [appliedSystemPrompt, setAppliedSystemPrompt] = useState(null);
  const [selectedToolIds, setSelectedToolIds] = useState(() => new Set());
  const [locationStatus, setLocationStatus] = useState({ state: "requesting" });

  const [messages, setMessages] = useState([]); // {id, role, content, turnIndex, toolCalls?, name?}
  const [turnCounter, setTurnCounter] = useState(0);
  const [usageByTurn, setUsageByTurn] = useState({});
  const [finishReasonByTurn, setFinishReasonByTurn] = useState({});

  const [inputText, setInputText] = useState("What can you help me with?");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingChunks, setStreamingChunks] = useState([]);

  const [viewMode, setViewMode] = useState("text"); // "text" | "json"
  const [modelSectionCollapsed, setModelSectionCollapsed] = useState(false);
  const [systemSectionCollapsed, setSystemSectionCollapsed] = useState(false);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, streamingChunks]);

  // Ask for geolocation permission as soon as the widget loads, well before
  // any tool call would need it, so the workshop demo isn't blocked on a
  // permission prompt mid-conversation.
  useEffect(() => {
    let cancelled = false;
    primeLocationPermission().then((result) => {
      if (cancelled) return;
      setLocationStatus(
        result.granted
          ? { state: "granted", location: result.location }
          : { state: "denied", error: result.error },
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function resetConversationState() {
    setMessages([]);
    setTurnCounter(0);
    setUsageByTurn({});
    setFinishReasonByTurn({});
    setStreamingChunks([]);
  }

  async function handleConnect() {
    setErrorMessage(null);
    setEngineStatus("loading");
    try {
      if (!apiKey) {
        throw new Error(
          "BERGET_API_KEY is not configured. Add it to frontend/.env and restart the dev server.",
        );
      }
      await verifyBergetModel({ apiKey, model: modelId });
      setAppliedSystemPrompt(systemPrompt);
      resetConversationState();
      setEngineStatus("ready");
      setModelSectionCollapsed(true);
      setSystemSectionCollapsed(true);
    } catch (err) {
      setEngineStatus("error");
      setErrorMessage(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleApplySystemPrompt() {
    setAppliedSystemPrompt(systemPrompt);
    resetConversationState();
    setSystemSectionCollapsed(true);
  }

  function handleToggleTool(toolId) {
    setSelectedToolIds((prev) => {
      const next = new Set(prev);
      if (next.has(toolId)) {
        next.delete(toolId);
      } else {
        next.add(toolId);
      }
      return next;
    });
    resetConversationState();
  }

  function handleResetConversation() {
    resetConversationState();
  }

  function handleStop() {
    abortControllerRef.current?.abort();
  }


  function toApiMessage(m) {
    if (m.role === "tool") {
      return { role: "tool", tool_call_id: m.toolCallId, content: m.content };
    }
    if (m.role === "assistant" && m.toolCalls) {
      return {
        role: "assistant",
        content: m.content || null,
        tool_calls: m.toolCalls.map((tc) => ({
          id: tc.id,
          type: "function",
          function: { name: tc.name, arguments: tc.arguments },
        })),
      };
    }
    return { role: m.role, content: m.content };
  }

  /**
   * Streams one model response, and if the model asks to call a tool, actually
   * executes it and loops back for the model's follow-up reply — so the
   * context view shows the real tool call + tool result + final answer.
   */
  async function runToolLoop(currentMessages, activeTools, newTurnIndex) {
    const maxRounds = 4;

    for (let round = 0; round < maxRounds; round += 1) {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      let usage = null;
      let finishReason = null;
      const toolCallAccumulator = {};
      const chunks = [];

      const stream = streamBergetChatCompletion({
        apiKey,
        model: modelId,
        messages: currentMessages,
        tools: activeTools.length ? activeTools.map((t) => t.schema) : undefined,
        signal: abortController.signal,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          chunks.push(delta);
          setStreamingChunks([...chunks]);
        }
        if (chunk.choices?.[0]?.delta?.tool_calls) {
          mergeToolCallDeltas(toolCallAccumulator, chunk.choices[0].delta.tool_calls);
        }
        if (chunk.choices?.[0]?.finish_reason) {
          finishReason = chunk.choices[0].finish_reason;
        }
        if (chunk.usage) {
          usage = chunk.usage;
        }
      }

      const assistantContent = chunks.join("");
      const toolCalls = Object.values(toolCallAccumulator);

      if (finishReason === "tool_calls" && toolCalls.length) {
        const normalizedCalls = toolCalls.map((tc) => ({
          id: tc.id ?? `call_${nextId()}`,
          name: tc.name,
          arguments: tc.arguments || "{}",
        }));

        const toolCallMsg = {
          id: nextId(),
          role: "assistant",
          content: assistantContent,
          toolCalls: normalizedCalls,
          turnIndex: newTurnIndex,
        };
        setMessages((prev) => [...prev, toolCallMsg]);
        setStreamingChunks([]);

        const toolResultApiMsgs = [];
        for (const tc of normalizedCalls) {
          let result;
          try {
            const def = getToolDefinition(tc.name);
            const args = tc.arguments ? JSON.parse(tc.arguments) : {};
            result = def
              ? await def.execute(args)
              : { error: `Unknown tool: ${tc.name}` };
          } catch (err) {
            result = { error: err instanceof Error ? err.message : String(err) };
          }
          const resultText = JSON.stringify(result);
          const toolResultMsg = {
            id: nextId(),
            role: "tool",
            name: tc.name,
            toolCallId: tc.id,
            content: resultText,
            turnIndex: newTurnIndex,
          };
          setMessages((prev) => [...prev, toolResultMsg]);
          toolResultApiMsgs.push(toApiMessage(toolResultMsg));
        }

        currentMessages = [
          ...currentMessages,
          toApiMessage(toolCallMsg),
          ...toolResultApiMsgs,
        ];
        continue; // ask the model again, now that it has the tool result
      }

      const assistantMsg = {
        id: nextId(),
        role: "assistant",
        content: assistantContent,
        turnIndex: newTurnIndex,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingChunks([]);
      if (usage) {
        setUsageByTurn((prev) => ({ ...prev, [newTurnIndex]: usage }));
      }
      if (finishReason) {
        setFinishReasonByTurn((prev) => ({ ...prev, [newTurnIndex]: finishReason }));
      }
      return;
    }

    setErrorMessage(
      "Tool-call loop exceeded the maximum number of rounds without a final answer.",
    );
  }

  async function handleSend() {
    const trimmed = inputText.trim();
    if (!apiKey || !trimmed || isGenerating || engineStatus !== "ready") return;

    const newTurnIndex = turnCounter + 1;
    const userMsg = {
      id: nextId(),
      role: "user",
      content: trimmed,
      turnIndex: newTurnIndex,
    };

    const priorMessages = messages.map(toApiMessage);
    const fullMessages = [
      { role: "system", content: appliedSystemPrompt ?? "" },
      ...priorMessages,
      { role: "user", content: trimmed },
    ];

    setMessages((prev) => [...prev, userMsg]);
    setTurnCounter(newTurnIndex);
    setInputText("");
    setIsGenerating(true);
    setStreamingChunks([]);
    setErrorMessage(null);

    try {
      await runToolLoop(fullMessages, activeTools, newTurnIndex);
    } catch (err) {
      if (err?.name !== "AbortError") {
        setErrorMessage(err instanceof Error ? err.message : String(err));
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }

  const isBusy = engineStatus === "loading" || isGenerating;
  const currentTurn = turnCounter;
  const selectedModel = MODEL_OPTIONS.find((m) => m.modelId === modelId);
  const activeTools = selectedModel?.supportsTools
    ? TOOL_DEFINITIONS.filter((t) => selectedToolIds.has(t.id))
    : [];

  function buildContextJson() {
    const json = {
      model: modelId,
      system: appliedSystemPrompt ?? null,
      tools: activeTools.map((t) => t.schema),
      messages: messages.map((m) => ({
        role: m.role,
        ...(m.name ? { name: m.name } : {}),
        ...(m.toolCalls ? { tool_calls: m.toolCalls } : {}),
        content: m.content,
        turn: m.turnIndex,
        cached: m.turnIndex !== currentTurn,
        ...(m.role === "assistant" && !m.toolCalls && usageByTurn[m.turnIndex]
          ? { usage: usageByTurn[m.turnIndex] }
          : {}),
        ...(m.role === "assistant" && !m.toolCalls && finishReasonByTurn[m.turnIndex]
          ? { finish_reason: finishReasonByTurn[m.turnIndex] }
          : {}),
      })),
    };
    if (isGenerating) {
      json.streaming = {
        role: "assistant",
        content: streamingChunks.join(""),
        turn: currentTurn,
        cached: false,
      };
    }
    return json;
  }

  return (
    <div className="llm-viz">
      <p className="llm-viz__intro">
        Calls a hosted open-source LLM via Berget AI's OpenAI-compatible API,
        then shows the exact context (system prompt, tools, history) sent to
        the model on every turn — and how much of it was already sent in a
        previous turn versus newly added.
      </p>

      {!apiKey && (
        <p className="llm-viz__error">
          BERGET_API_KEY is not configured. Add it to frontend/.env and
          restart the dev server.
        </p>
      )}

      <CollapsibleSection
        title="Model selection"
        collapsed={modelSectionCollapsed}
        onToggleCollapsed={() => setModelSectionCollapsed((prev) => !prev)}
        summary={
          selectedModel
            ? `${selectedModel.label}${
                selectedModel.supportsTools ? " 🛠️" : ""
              } — ${engineStatus === "ready" ? "✅ Ready" : engineStatus}`
            : undefined
        }
      >
        <div className="llm-viz__row llm-viz__row--wrap">
          <label className="llm-viz__select">
            Model
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              disabled={isBusy}
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.modelId} value={m.modelId}>
                  {m.supportsTools ? "🛠️ " : ""}
                  {m.label} ({m.size})
                </option>
              ))}
            </select>
          </label>
          {selectedModel?.supportsTools && (
            <span
              className="llm-viz__tool-badge"
              title="This model supports native tool/function calling"
            >
              🛠️ tool calling
            </span>
          )}
          <button onClick={handleConnect} disabled={isBusy || !apiKey}>
            {engineStatus === "ready" ? "Reconnect" : "Connect"}
          </button>
          <span className="llm-viz__status">
            {engineStatus === "unloaded" && "Not loaded"}
            {engineStatus === "loading" && "Connecting…"}
            {engineStatus === "ready" && "✅ Ready"}
            {engineStatus === "error" && "❌ Error"}
          </span>
        </div>
        {selectedModel && <p className="llm-viz__hint">{selectedModel.note}</p>}

        {selectedModel?.supportsTools ? (
          <div className="llm-viz__tools-list">
            <span className="llm-viz__label">Tools available to the model</span>
            {TOOL_DEFINITIONS.map((tool) => (
              <label key={tool.id} className="llm-viz__checkbox">
                <input
                  type="checkbox"
                  checked={selectedToolIds.has(tool.id)}
                  onChange={() => handleToggleTool(tool.id)}
                  disabled={isBusy}
                />
                {tool.label}
                <span className="llm-viz__tool-desc"> — {tool.description}</span>
              </label>
            ))}
            <p className="llm-viz__hint">
              📍 Location permission:{" "}
              {locationStatus.state === "requesting" && "requesting…"}
              {locationStatus.state === "granted" &&
                `granted (${locationStatus.location.latitude.toFixed(2)}, ${locationStatus.location.longitude.toFixed(2)})`}
              {locationStatus.state === "denied" &&
                `not granted — ${locationStatus.error}`}
            </p>
          </div>
        ) : (
          <p className="llm-viz__hint">
            This model doesn't support tool calling — pick a model marked 🛠️ to
            enable tools.
          </p>
        )}
      </CollapsibleSection>

      {errorMessage && <p className="llm-viz__error">{errorMessage}</p>}

      <CollapsibleSection
        title="System prompt"
        collapsed={systemSectionCollapsed}
        onToggleCollapsed={() => setSystemSectionCollapsed((prev) => !prev)}
        summary={appliedSystemPrompt ? `"${appliedSystemPrompt.slice(0, 60)}${appliedSystemPrompt.length > 60 ? "…" : ""}"` : "(not applied)"}
      >
        <textarea
          id="system-prompt"
          className="llm-viz__textarea"
          rows={3}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          disabled={isBusy}
        />
        <div className="llm-viz__row">
          <button
            onClick={handleApplySystemPrompt}
            disabled={isBusy || engineStatus !== "ready" || systemPrompt === appliedSystemPrompt}
          >
            Apply system prompt (resets conversation)
          </button>
        </div>
      </CollapsibleSection>

      <section className="llm-viz__section">
        <div className="llm-viz__context-header">
          <h3>Context sent to the model</h3>
          <div className="llm-viz__context-header-actions">
            <div className="llm-viz__view-toggle" role="tablist">
              <button
                role="tab"
                aria-selected={viewMode === "text"}
                className={viewMode === "text" ? "is-active" : ""}
                onClick={() => setViewMode("text")}
              >
                Text
              </button>
              <button
                role="tab"
                aria-selected={viewMode === "json"}
                className={viewMode === "json" ? "is-active" : ""}
                onClick={() => setViewMode("json")}
              >
                Raw JSON
              </button>
            </div>
            <button
              className="llm-viz__ghost-btn"
              onClick={handleResetConversation}
              disabled={isBusy || engineStatus !== "ready" || messages.length === 0}
            >
              Reset conversation
            </button>
          </div>
        </div>

        {viewMode === "text" ? (
          <div className="llm-viz__context">
            {appliedSystemPrompt !== null && (
              <ContextBlock role="system" isNew={messages.length === 0}>
                {appliedSystemPrompt || <em>(empty)</em>}
              </ContextBlock>
            )}
            {activeTools.length > 0 && appliedSystemPrompt !== null && (
              <ContextBlock role="tools" isNew={messages.length === 0}>
                <pre className="ctx-block__json">
                  {JSON.stringify(
                    activeTools.map((t) => t.schema),
                    null,
                    2,
                  )}
                </pre>
              </ContextBlock>
            )}
            {messages.map((m) => (
              <ContextBlock
                key={m.id}
                role={m.role}
                isNew={m.turnIndex === currentTurn}
                toolName={m.role === "tool" ? m.name : undefined}
                finishReason={
                  m.role === "assistant" && !m.toolCalls
                    ? finishReasonByTurn[m.turnIndex]
                    : undefined
                }
                statsText={
                  m.role === "assistant" && !m.toolCalls && usageByTurn[m.turnIndex]
                    ? `prompt: ${usageByTurn[m.turnIndex].prompt_tokens} token(s) sent · generated: ${usageByTurn[m.turnIndex].completion_tokens} token(s)`
                    : undefined
                }
              >
                {m.toolCalls ? (
                  <>
                    <ToolCallList toolCalls={m.toolCalls} />
                    {m.content && <div className="ctx-block__tool-text">{m.content}</div>}
                  </>
                ) : m.role === "tool" ? (
                  <pre className="ctx-block__json">{m.content}</pre>
                ) : (
                  m.content
                )}
              </ContextBlock>
            ))}
            {isGenerating && (
              <ContextBlock role="assistant" isNew isStreaming>
                {streamingChunks.join("")}
              </ContextBlock>
            )}
            {appliedSystemPrompt === null && messages.length === 0 && !isGenerating && (
              <p className="llm-viz__hint">Load a model to begin.</p>
            )}
            <div ref={scrollAnchorRef} />
          </div>
        ) : (
          <div className="llm-viz__context llm-viz__context--json">
            {appliedSystemPrompt === null && messages.length === 0 && !isGenerating ? (
              <p className="llm-viz__hint">Load a model to begin.</p>
            ) : (
              <JsonValue value={buildContextJson()} />
            )}
            <div ref={scrollAnchorRef} />
          </div>
        )}
      </section>

      <section className="llm-viz__section llm-viz__composer">
        <textarea
          className="llm-viz__textarea"
          rows={2}
          placeholder="Type a message…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={engineStatus !== "ready" || isGenerating}
        />
        <div className="llm-viz__row">
          <button
            onClick={handleSend}
            disabled={engineStatus !== "ready" || isGenerating || !inputText.trim()}
          >
            Send
          </button>
          {isGenerating && (
            <button className="llm-viz__ghost-btn" onClick={handleStop}>
              Stop
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
