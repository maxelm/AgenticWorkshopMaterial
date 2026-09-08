import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import "./LlmAgentHarnessWidget.css";

const WIDTH = 960;
const HEIGHT = 560;

const DETAIL_ORDER = ["harness", "llm", "agent", "context", "tools", "user"];

const DETAILS = {
  harness: {
    title: "Harness",
    subtitle: "The runtime that actually does the work",
    body:
      "The harness is the only part that can execute anything for real. It holds the state, calls the LLM, interprets the returned text, chooses whether that text means 'run a tool' or 'answer the user', and keeps the loop moving.",
    bullets: [
      "Owns the context window and decides what goes into each model call.",
      "Owns the tool catalog and runs the tools itself.",
      "Decides when to continue the loop and when to stop.",
    ],
  },
  llm: {
    title: "LLM",
    subtitle: "A token generator, not an executor",
    body:
      "The LLM only predicts the next tokens from the prompt it receives. It does not keep memory on its own, cannot call tools directly, and does not control the environment.",
    bullets: [
      "Gets context from the harness.",
      "Returns text back to the harness.",
      "Never touches files, processes, or APIs by itself.",
    ],
  },
  agent: {
    title: "Agent",
    subtitle: "A behavior that emerges from the loop",
    body:
      "The agent is not a separate box. It's the repeated loop where the harness calls the LLM, executes tools, updates context, and keeps iterating toward a goal.",
    bullets: [
      "Harness drives the loop.",
      "LLM contributes the next-step suggestion as text.",
      "Tool execution and stopping decisions stay with the harness.",
    ],
  },
  context: {
    title: "Context",
    subtitle: "Memory assembled by the harness",
    body:
      "Conversation history, instructions, retrieved files, tool outputs, and intermediate results all live here. The harness curates this state and decides what to send to the LLM next.",
    bullets: [
      "Stateful across turns because the harness stores it.",
      "Updated after every tool result and user message.",
      "Fed into each LLM call as part of the prompt.",
    ],
  },
  tools: {
    title: "Tools",
    subtitle: "Capabilities the harness owns",
    body:
      "Tools are real side effects: read a file, run a command, browse a page, call an API. The harness exposes those abilities and executes them when needed.",
    bullets: [
      "The LLM can only describe a tool call in text.",
      "The harness validates and executes the action.",
      "Tool results come back into context for the next loop.",
    ],
  },
  user: {
    title: "User",
    subtitle: "Source of the goal, destination for the answer",
    body:
      "The user provides the goal. The harness turns that goal into an LLM-and-tools loop, then returns the final answer when the work is complete.",
    bullets: [
      "Prompt enters through the harness.",
      "Final answer exits through the harness.",
      "The LLM is never contacted directly by the user in this workflow.",
    ],
  },
};

const SUMMARY_CARDS = [
  {
    title: "Harness executes",
    body: "Anything stateful or side-effectful happens in the harness, not in the LLM.",
  },
  {
    title: "Harness owns context",
    body: "Memory across turns exists because the harness keeps rebuilding the prompt.",
  },
  {
    title: "Harness owns tools",
    body: "Tools are real capabilities exposed and run by the harness.",
  },
  {
    title: "Agent = loop",
    body: "Agentic behavior is the harness repeatedly using the LLM plus tools toward a goal.",
  },
];

export default function LlmAgentHarnessWidget() {
  const svgRef = useRef(null);
  const [selectedId, setSelectedId] = useState("harness");
  const selected = useMemo(
    () => DETAILS[selectedId] || DETAILS.harness,
    [selectedId]
  );

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

    const defs = svg.append("defs");
    const defsGlow = defs
      .append("filter")
      .attr("id", "lah-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    defsGlow.append("feGaussianBlur").attr("stdDeviation", 5).attr("result", "blur");
    defsGlow
      .append("feMerge")
      .selectAll("feMergeNode")
      .data(["blur", "SourceGraphic"])
      .join("feMergeNode")
      .attr("in", (d) => d);

    const root = svg.append("g");
    const loopLayer = root.append("g");
    const harnessLayer = root.append("g");
    const contentLayer = root.append("g");

    const makeInteractive = (selection, id) => {
      selection
        .attr("tabindex", 0)
        .attr("role", "button")
        .attr("style", "cursor: pointer;")
        .on("mouseenter", () => setSelectedId(id))
        .on("click", () => setSelectedId(id))
        .on("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectedId(id);
          }
        });
    };

    const renderLabel = (group, x, y, label, className = "lah__svg-label") => {
      group
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("class", className)
        .attr("text-anchor", "middle")
        .text(label);
    };

    const renderTextLines = (group, x, y, lines, className, lineHeight = 28) => {
      const text = group.append("text").attr("x", x).attr("y", y).attr("class", className);
      lines.forEach((line, index) => {
        text
          .append("tspan")
          .attr("x", x)
          .attr("dy", index === 0 ? 0 : lineHeight)
          .text(line);
      });
    };

    const agentGroup = loopLayer.append("g");
    agentGroup
      .append("ellipse")
      .attr("class", `lah__svg-agent-loop${selectedId === "agent" ? " is-selected" : ""}`)
      .attr("cx", 610)
      .attr("cy", 286)
      .attr("rx", 365)
      .attr("ry", 228);
    renderLabel(
      agentGroup,
      610,
      40,
      "AGENT = the repeated harness-driven loop",
      "lah__svg-loop-label"
    );
    makeInteractive(agentGroup, "agent");

    const harnessRectGroup = harnessLayer.append("g");
    harnessRectGroup
      .append("rect")
      .attr("class", `lah__svg-harness${selectedId === "harness" ? " is-selected" : ""}`)
      .attr("x", 220)
      .attr("y", 108)
      .attr("width", 470)
      .attr("height", 342)
      .attr("rx", 26)
      .attr("ry", 26);
    makeInteractive(harnessRectGroup, "harness");

    const harnessGroup = contentLayer.append("g");
    harnessGroup
      .append("text")
      .attr("x", 255)
      .attr("y", 146)
      .attr("class", "lah__svg-harness-kicker")
      .text("HARNESS");
    renderTextLines(
      harnessGroup,
      255,
      178,
      ["Holds state, drives the LLM,", "and owns tool execution"],
      "lah__svg-harness-title",
      30
    );
    renderTextLines(
      harnessGroup,
      255,
      236,
      ["Every real action and every stopping", "decision happens here."],
      "lah__svg-harness-subtitle",
      22
    );
    makeInteractive(harnessGroup, "harness");

    const internalCards = [
      {
        id: "context",
        x: 280,
        y: 262,
        width: 168,
        height: 92,
        icon: "🗂️",
        title: "Context",
        subtitle: "memory the harness keeps",
      },
      {
        id: "harness",
        x: 502,
        y: 236,
        width: 138,
        height: 120,
        icon: "⚙️",
        title: "Runtime",
        subtitle: "interpret, decide,\nexecute, repeat",
      },
      {
        id: "tools",
        x: 280,
        y: 360,
        width: 168,
        height: 92,
        icon: "🛠️",
        title: "Tools",
        subtitle: "files, shell, browser, APIs",
      },
    ];

    internalCards.forEach((card) => {
      const cardGroup = contentLayer.append("g");
      const selectedClass = selectedId === card.id ? " is-selected" : "";
      cardGroup
        .append("rect")
        .attr("class", `lah__svg-card${selectedClass}`)
        .attr("x", card.x)
        .attr("y", card.y)
        .attr("width", card.width)
        .attr("height", card.height)
        .attr("rx", 20)
        .attr("ry", 20);
      cardGroup
        .append("text")
        .attr("x", card.x + 20)
        .attr("y", card.y + 32)
        .attr("class", "lah__svg-card-icon")
        .text(card.icon);
      cardGroup
        .append("text")
        .attr("x", card.x + 52)
        .attr("y", card.y + 32)
        .attr("class", "lah__svg-card-title")
        .text(card.title);

      const subtitleLines = card.subtitle.split("\n");
      subtitleLines.forEach((line, index) => {
        cardGroup
          .append("text")
          .attr("x", card.x + 20)
          .attr("y", card.y + 58 + index * 18)
          .attr("class", "lah__svg-card-subtitle")
          .text(line);
      });
      makeInteractive(cardGroup, card.id);
    });

    const userGroup = contentLayer.append("g");
    userGroup
      .append("rect")
      .attr("class", `lah__svg-user${selectedId === "user" ? " is-selected" : ""}`)
      .attr("x", 40)
      .attr("y", 220)
      .attr("width", 132)
      .attr("height", 136)
      .attr("rx", 24)
      .attr("ry", 24);
    userGroup
      .append("text")
      .attr("x", 106)
      .attr("y", 266)
      .attr("text-anchor", "middle")
      .attr("class", "lah__svg-user-icon")
      .text("👤");
    userGroup
      .append("text")
      .attr("x", 106)
      .attr("y", 300)
      .attr("text-anchor", "middle")
      .attr("class", "lah__svg-user-title")
      .text("User");
    userGroup
      .append("text")
      .attr("x", 106)
      .attr("y", 326)
      .attr("text-anchor", "middle")
      .attr("class", "lah__svg-user-subtitle")
      .text("sets the goal");
    makeInteractive(userGroup, "user");

    const llmGroup = contentLayer.append("g");
    llmGroup
      .append("circle")
      .attr("class", `lah__svg-llm${selectedId === "llm" ? " is-selected" : ""}`)
      .attr("cx", 826)
      .attr("cy", 280)
      .attr("r", 84)
      .attr("filter", selectedId === "llm" ? "url(#lah-glow)" : null);
    llmGroup
      .append("text")
      .attr("x", 826)
      .attr("y", 262)
      .attr("text-anchor", "middle")
      .attr("class", "lah__svg-llm-icon")
      .text("🧠");
    llmGroup
      .append("text")
      .attr("x", 826)
      .attr("y", 296)
      .attr("text-anchor", "middle")
      .attr("class", "lah__svg-llm-title")
      .text("LLM");
    llmGroup
      .append("text")
      .attr("x", 826)
      .attr("y", 324)
      .attr("text-anchor", "middle")
      .attr("class", "lah__svg-llm-subtitle")
      .text("predicts next tokens");
    makeInteractive(llmGroup, "llm");
  }, [selectedId]);

  return (
    <div className="lah">
      <p className="lah__intro">
        The diagram centers the <strong>Harness</strong> because that's the part that
        actually runs the system: it stores context, drives the <strong>LLM</strong>,
        owns the tools, and creates the repeated loop we call an <strong>Agent</strong>.
      </p>

      <div className="lah__layout">
        <section className="lah__panel lah__panel--viz">
          <div className="lah__panel-header">
            <h2 className="lah__panel-title">D3 relationship map</h2>
            <p className="lah__panel-copy">
              Hover or click the diagram to inspect each role in the loop.
            </p>
          </div>

          <svg
            ref={svgRef}
            className="lah__svg"
            role="img"
            aria-label="Diagram showing the harness holding context and tools, driving the LLM, and creating agent behavior through a loop."
          />

          <div className="lah__selector-row" aria-label="Relationship details">
            {DETAIL_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                className={`lah__selector ${selectedId === id ? "lah__selector--active" : ""}`}
                onClick={() => setSelectedId(id)}
              >
                {DETAILS[id].title}
              </button>
            ))}
          </div>
        </section>

        <aside className="lah__panel lah__panel--detail">
          <div className="lah__detail-kicker">Focused explanation</div>
          <h2 className="lah__detail-title">{selected.title}</h2>
          <p className="lah__detail-subtitle">{selected.subtitle}</p>
          <p className="lah__detail-body">{selected.body}</p>
          <ul className="lah__detail-list">
            {selected.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="lah__summary-grid">
        {SUMMARY_CARDS.map((card) => (
          <div key={card.title} className="lah__summary-card">
            <div className="lah__summary-title">{card.title}</div>
            <p className="lah__summary-body">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
