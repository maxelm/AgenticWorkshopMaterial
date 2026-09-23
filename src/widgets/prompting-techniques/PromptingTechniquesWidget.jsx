import { PRINCIPLES } from "./promptingData.js";
import "./PromptingTechniquesWidget.css";

function RevealSurface({ className, style, children }) {
  return (
    <article className={`${className} ptw__reveal-surface`} style={style}>
      <div className="ptw__reveal-content">{children}</div>
    </article>
  );
}

function PrincipleCard({ principle }) {
  return (
    <RevealSurface
      className="ptw__card"
      style={{ "--ptw-accent": principle.accent }}
    >
      <div className="ptw__card-head">
        <span className="ptw__icon" aria-hidden="true">
          {principle.icon}
        </span>
        <h3>{principle.title}</h3>
      </div>

      <p className="ptw__summary">{principle.summary}</p>

      <ul className="ptw__points">
        {principle.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      {principle.goldenRule && (
        <p className="ptw__callout ptw__callout--rule">{principle.goldenRule}</p>
      )}

      {principle.tip && (
        <p className="ptw__callout ptw__callout--tip">{principle.tip}</p>
      )}

      {principle.example && (
        <div className="ptw__example">
          <div className="ptw__example-label">{principle.example.label}</div>
          <div className="ptw__example-row ptw__example-row--less">
            <span className="ptw__example-tag">Less effective</span>
            <code>{principle.example.less}</code>
          </div>
          <div className="ptw__example-row ptw__example-row--more">
            <span className="ptw__example-tag">More effective</span>
            <code>{principle.example.more}</code>
          </div>
        </div>
      )}
    </RevealSurface>
  );
}

export default function PromptingTechniquesWidget() {
  return (
    <div className="ptw">
      <section className="ptw__hero">
        <div className="ptw__eyebrow">Prompt Engineering</div>
        <h2>General principles for prompting an agent</h2>
        <p>
          Distilled from Anthropic's prompting best practices guide - the
          model-agnostic techniques that apply across LLM agents in general,
          before you layer on output formatting, tool use, thinking, or
          agentic-system guidance.
        </p>
        <a
          href="https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#general-principles"
          target="_blank"
          rel="noreferrer"
          className="ptw__source-link"
        >
          Read the full guide ↗
        </a>
      </section>

      <section className="ptw__grid" aria-label="General principles">
        {PRINCIPLES.map((principle) => (
          <PrincipleCard key={principle.id} principle={principle} />
        ))}
      </section>
    </div>
  );
}
