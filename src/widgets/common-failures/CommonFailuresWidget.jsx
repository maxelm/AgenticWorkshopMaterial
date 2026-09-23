import { FAILURES } from "./failuresData.js";
import "./CommonFailuresWidget.css";

function RevealSurface({ className, style, children }) {
  return (
    <article className={`${className} cfw__reveal-surface`} style={style}>
      <div className="cfw__reveal-content">{children}</div>
    </article>
  );
}

function FailureCard({ failure }) {
  return (
    <RevealSurface
      className="cfw__card"
      style={{ "--cfw-accent": failure.accent }}
    >
      <div className="cfw__card-head">
        <span className="cfw__icon" aria-hidden="true">
          {failure.icon}
        </span>
        <h3>{failure.title}</h3>
      </div>

      <p className="cfw__summary">{failure.summary}</p>

      <ul className="cfw__points">
        {failure.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      {failure.goldenRule && (
        <p className="cfw__callout cfw__callout--rule">{failure.goldenRule}</p>
      )}

      {failure.tip && (
        <p className="cfw__callout cfw__callout--tip">{failure.tip}</p>
      )}
    </RevealSurface>
  );
}

export default function CommonFailuresWidget() {
  return (
    <div className="cfw">
      <section className="cfw__hero">
        <div className="cfw__eyebrow">Retrospective</div>
        <h2>Common failures when adopting agentic coding</h2>
        <p>
          The recurring ways teams trip up when leaning on coding agents -
          from context that grows stale, to review capacity that doesn't
          scale, to skipping the plan entirely.
        </p>
      </section>

      <section className="cfw__grid" aria-label="Common failures">
        {FAILURES.map((failure) => (
          <FailureCard key={failure.id} failure={failure} />
        ))}
      </section>
    </div>
  );
}
