import { useMemo, useState } from "react";
import {
  FILE_TREE,
  STEPS,
} from "./projectData.js";
import "./AgentContextWidget.css";

// Very rough "tokens" estimate for the size meter - not a real tokenizer,
// just enough to visualize relative growth of the context window.
function estimateTokens(text) {
  if (!text) return 0;
  return Math.max(1, Math.round(text.length / 4));
}

function blockText(block) {
  if (block.content) return block.content;
  if (block.items) {
    return block.items
      .map((item) => JSON.stringify(item))
      .join("\n");
  }
  return "";
}

function FileNode({ node, depth, activePaths, loadedPaths }) {
  const isFolder = node.type === "folder";
  const isActive = activePaths.has(node.path);
  const isLoaded = loadedPaths.has(node.path);

  const classNames = ["actx__node"];
  if (isFolder) classNames.push("actx__node--folder");
  if (isActive) classNames.push("actx__node--active");
  else if (isLoaded) classNames.push("actx__node--loaded");

  return (
    <div className="actx__tree-item">
      <div
        className={classNames.join(" ")}
        style={{ paddingLeft: `${depth * 1.1 + 0.4}rem` }}
      >
        <span className="actx__node-icon">
          {isFolder ? "📁" : "📄"}
        </span>
        <span className="actx__node-name">{node.name}</span>
        {isActive && <span className="actx__node-badge">reading…</span>}
        {!isActive && isLoaded && (
          <span className="actx__node-check" title="Already added to context">
            ✓
          </span>
        )}
      </div>
      {isFolder &&
        node.children?.map((child) => (
          <FileNode
            key={child.path}
            node={child}
            depth={depth + 1}
            activePaths={activePaths}
            loadedPaths={loadedPaths}
          />
        ))}
    </div>
  );
}

function SkillsBlockBody({ items }) {
  return (
    <ul className="actx__block-list">
      {items.map((skill) => (
        <li key={skill.id} className="actx__block-list-item">
          <div className="actx__block-list-title">🧩 {skill.name}</div>
          <div className="actx__block-list-desc">{skill.description}</div>
          <div className="actx__block-list-meta">{skill.whenToUse}</div>
        </li>
      ))}
    </ul>
  );
}

function McpBlockBody({ items }) {
  return (
    <ul className="actx__block-list">
      {items.map((server) => (
        <li key={server.id} className="actx__block-list-item">
          <div className="actx__block-list-title">🔌 {server.name}</div>
          <div className="actx__block-list-meta">{server.command}</div>
          <ul className="actx__block-sublist">
            {server.tools.map((tool) => (
              <li key={tool.name}>
                <code>{tool.name}</code> — {tool.description}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

const KIND_LABELS = {
  system: { icon: "⚙️", className: "actx__block--system" },
  "agents-md": { icon: "📘", className: "actx__block--agents" },
  skills: { icon: "🧩", className: "actx__block--skills" },
  "skill-full": { icon: "🧩", className: "actx__block--skills" },
  mcp: { icon: "🔌", className: "actx__block--mcp" },
  user: { icon: "💬", className: "actx__block--user" },
  "file-ref": { icon: "📄", className: "actx__block--file-ref" },
};

function ContextBlockView({ block, tokens }) {
  const meta = KIND_LABELS[block.kind] ?? { icon: "•", className: "" };
  return (
    <div className={`actx__block ${meta.className}`}>
      <div className="actx__block-header">
        <span className="actx__block-icon">{meta.icon}</span>
        <div className="actx__block-heading">
          <div className="actx__block-title">{block.title}</div>
          <div className="actx__block-subtitle">{block.subtitle}</div>
        </div>
        <span className="actx__block-tokens">~{tokens} tok</span>
      </div>
      {block.content && <pre className="actx__block-content">{block.content}</pre>}
      {block.items && block.kind === "skills" && <SkillsBlockBody items={block.items} />}
      {block.items && block.kind === "mcp" && <McpBlockBody items={block.items} />}
    </div>
  );
}

export default function AgentContextWidget() {
  const [stepIndex, setStepIndex] = useState(0); // number of steps applied so far

  const totalSteps = STEPS.length;
  const isDone = stepIndex >= totalSteps;
  const appliedSteps = STEPS.slice(0, stepIndex);
  const currentStep = stepIndex > 0 ? STEPS[stepIndex - 1] : null;
  const nextStep = !isDone ? STEPS[stepIndex] : null;

  const activePaths = useMemo(
    () => new Set(currentStep?.highlightPaths ?? []),
    [currentStep]
  );
  const loadedPaths = useMemo(() => {
    const set = new Set();
    appliedSteps.forEach((step) => {
      step.highlightPaths?.forEach((p) => set.add(p));
    });
    // Once superseded by a later step, a path is "loaded" not "active".
    activePaths.forEach((p) => set.delete(p));
    return set;
  }, [appliedSteps, activePaths]);

  const tokensPerBlock = useMemo(
    () => appliedSteps.map((step) => estimateTokens(blockText(step.contextBlock))),
    [appliedSteps]
  );
  const totalTokens = tokensPerBlock.reduce((a, b) => a + b, 0);
  const maxTokens = 4000; // purely visual scale for the meter
  const meterPct = Math.min(100, Math.round((totalTokens / maxTokens) * 100));

  const handleStep = () => {
    setStepIndex((i) => Math.min(totalSteps, i + 1));
  };
  const handleReset = () => setStepIndex(0);

  return (
    <div className="actx">
      <p className="actx__intro">
        Watch how a coding agent's context window is assembled step by step:
        system prompt, root <code>AGENTS.md</code>, discovered Agent Skills,
        connected MCP server tools, and your prompt - then watch the prompt's
        own wording pull in a scoped sub-folder <code>AGENTS.md</code>, load
        the one relevant skill in full, and resolve an <code>@file</code>{" "}
        reference. Nothing here is a real agent - it's a fixed walkthrough
        for illustration.
      </p>

      <div className="actx__toolbar">
        <button
          type="button"
          className="actx__button actx__button--primary"
          onClick={handleStep}
          disabled={isDone}
        >
          {isDone ? "All steps loaded" : `▶ Step: ${nextStep.label}`}
        </button>
        <button type="button" className="actx__button" onClick={handleReset} disabled={stepIndex === 0}>
          ⟲ Reset
        </button>
        <div className="actx__progress">
          Step {Math.min(stepIndex, totalSteps)} of {totalSteps}
        </div>
      </div>

      {currentStep && <p className="actx__step-desc">{currentStep.description}</p>}
      {!currentStep && (
        <p className="actx__step-desc actx__step-desc--muted">
          Nothing loaded yet. Press "Step" to begin.
        </p>
      )}

      <div className="actx__panes">
        <section className="actx__pane actx__pane--files">
          <h2 className="actx__pane-title">📁 Project files</h2>
          <div className="actx__tree">
            <FileNode
              node={FILE_TREE}
              depth={0}
              activePaths={activePaths}
              loadedPaths={loadedPaths}
            />
          </div>
        </section>

        <section className="actx__pane actx__pane--context">
          <div className="actx__pane-header">
            <h2 className="actx__pane-title">🧠 Context window</h2>
            <span className="actx__meter-label">~{totalTokens} tokens</span>
          </div>
          <div className="actx__meter">
            <div className="actx__meter-fill" style={{ width: `${meterPct}%` }} />
          </div>

          {appliedSteps.length === 0 && (
            <div className="actx__empty">Context is empty.</div>
          )}

          <div className="actx__blocks">
            {appliedSteps.map((step, i) => (
              <ContextBlockView
                key={step.id}
                block={step.contextBlock}
                tokens={tokensPerBlock[i]}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
