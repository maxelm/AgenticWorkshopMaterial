import { HERO_POINTS, PRINCIPLES } from "./agentsMdData.js";
import "./AgentsMdWidget.css";

function RevealSurface({ className, style, children }) {
  return (
    <article className={`${className} amw__reveal-surface`} style={style}>
      <div className="amw__reveal-content">{children}</div>
    </article>
  );
}

function PrincipleCard({ principle }) {
  return (
    <RevealSurface
      className="amw__card"
      style={{ "--amw-accent": principle.accent }}
    >
      <div className="amw__card-head">
        <span className="amw__icon" aria-hidden="true">
          {principle.icon}
        </span>
        <h3>{principle.title}</h3>
      </div>

      <p className="amw__summary">{principle.summary}</p>

      <ul className="amw__points">
        {principle.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      {principle.goldenRule && (
        <p className="amw__callout amw__callout--rule">{principle.goldenRule}</p>
      )}

      {principle.tip && (
        <p className="amw__callout amw__callout--tip">{principle.tip}</p>
      )}

      {principle.example && (
        <div className="amw__example">
          <div className="amw__example-label">{principle.example.label}</div>
          <div className="amw__example-row amw__example-row--less">
            <span className="amw__example-tag">Avoid</span>
            <code>{principle.example.less}</code>
          </div>
          <div className="amw__example-row amw__example-row--more">
            <span className="amw__example-tag">Prefer</span>
            <code>{principle.example.more}</code>
          </div>
        </div>
      )}
    </RevealSurface>
  );
}

export default function AgentsMdWidget() {
  return (
    <div className="amw">
      <section className="amw__hero">
        <div className="amw__hero-copy">
          <div className="amw__eyebrow">Agent Memory</div>
          <h2>AGENTS.md is the highest-leverage file in your repo</h2>
          <p>
            AGENTS.md is the open, cross-tool standard for onboarding AI
            coding assistants into a codebase. Distilled from a comprehensive
            best-practices guide covering structure, essential sections,
            security, and the anti-patterns that undermine it.
          </p>
          <a
            href="https://gist.github.com/0xfauzi/7c8f65572930a21efa62623557d83f6e"
            target="_blank"
            rel="noreferrer"
            className="amw__source-link"
          >
            Read the full guide ↗
          </a>
        </div>

        <div className="amw__hero-points">
          {HERO_POINTS.map((point) => (
            <article key={point.label} className="amw__hero-card">
              <div className="amw__hero-label">{point.label}</div>
              <strong>{point.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="amw__grid" aria-label="Best practices">
        {PRINCIPLES.map((principle) => (
          <PrincipleCard key={principle.id} principle={principle} />
        ))}
      </section>
    </div>
  );
}
