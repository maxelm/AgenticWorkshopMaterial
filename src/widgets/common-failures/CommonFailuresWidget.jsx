import { useMemo, useState } from "react";
import { FAILURES } from "./failuresData.js";
import "./CommonFailuresWidget.css";

function RevealSurface({ id, isRevealed, onReveal, className, style, children }) {
  return (
    <article
      className={`${className} cfw__reveal-surface${isRevealed ? " is-revealed" : ""}`}
      style={style}
    >
      {!isRevealed ? (
        <button
          type="button"
          className="cfw__reveal-button"
          onClick={() => onReveal(id)}
          aria-label={`Reveal ${id.replaceAll("-", " ")}`}
        />
      ) : null}

      <div className="cfw__reveal-content" aria-hidden={!isRevealed}>
        {children}
      </div>
    </article>
  );
}

function FailureCard({ failure, isRevealed, onReveal }) {
  return (
    <RevealSurface
      id={failure.id}
      isRevealed={isRevealed}
      onReveal={onReveal}
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
  const [revealedIds, setRevealedIds] = useState([]);

  const revealedLookup = useMemo(() => new Set(revealedIds), [revealedIds]);

  const handleReveal = (id) => {
    setRevealedIds((current) => (current.includes(id) ? current : [...current, id]));
  };

  const handleReset = () => {
    setRevealedIds([]);
  };

  return (
    <div className="cfw">
      <section className="cfw__hero">
        <div className="cfw__eyebrow">Retrospective</div>
        <h2>Common failures when adopting agentic coding</h2>
        <p>
          The recurring ways teams trip up when leaning on coding agents -
          from context that grows stale, to review capacity that doesn't
          scale, to skipping the plan entirely. Click a pane to reveal each
          failure mode.
        </p>
      </section>

      <div className="cfw__toolbar">
        <button
          type="button"
          className="cfw__reset-button"
          onClick={handleReset}
          disabled={revealedIds.length === 0}
        >
          Reset cards
        </button>
      </div>

      <section className="cfw__grid" aria-label="Common failures">
        {FAILURES.map((failure) => (
          <FailureCard
            key={failure.id}
            failure={failure}
            isRevealed={revealedLookup.has(failure.id)}
            onReveal={handleReveal}
          />
        ))}
      </section>
    </div>
  );
}
