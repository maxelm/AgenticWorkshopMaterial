import {
  MATURITY_DIMENSIONS,
  MATURITY_LEVELS,
} from "./maturityData.js";
import "./AgentMaturityWidget.css";

function RevealSurface({ className, style, children }) {
  return (
    <div className={`${className} amw__reveal-surface`} style={style}>
      <div className="amw__reveal-content">{children}</div>
    </div>
  );
}

function LevelCard({ level, isLast }) {
  return (
    <RevealSurface
      className="amw__level-card"
      style={{ "--amw-accent": level.accent }}
    >
      <article>
        <div className="amw__level-topline">
          <span className="amw__step-badge">Level {level.step}</span>
          {!isLast ? <span className="amw__arrow">→</span> : null}
        </div>
        <h3>{level.label}</h3>
        <img
          className="amw__level-image"
          src={level.image}
          alt={`Illustration for Level ${level.step}: ${level.label}`}
        />
        <p className="amw__summary">{level.summary}</p>
        <p>{level.details}</p>

        <ul className="amw__trait-list">
          {level.traits.map((trait) => (
            <li key={trait}>{trait}</li>
          ))}
        </ul>

        <div className="amw__shift">
          <strong>What changes:</strong> {level.shift}
        </div>
      </article>
    </RevealSurface>
  );
}

export default function AgentMaturityWidget() {
  return (
    <div className="amw">
      <section className="amw__hero">
        <div className="amw__hero-copy">
          <div className="amw__eyebrow">Three-step maturity model</div>
          <h2>Three Levels of Agentic Coding</h2>
          <p>
            Agentic coding tends to evolve through a recognizable progression:
            first you prompt and wait, then you run several sessions in
            parallel, and eventually you move to a spec-driven system where
            coordinating agents create and dispatch work to other agents.
          </p>
        </div>

        <div className="amw__hero-summary">
          <div className="amw__summary-item">
            <span>Level 1</span>
            <strong>Agent as assistant</strong>
          </div>
          <div className="amw__summary-item">
            <span>Level 2</span>
            <strong>Agent as parallel team</strong>
          </div>
          <div className="amw__summary-item">
            <span>Level 3</span>
            <strong>Agent as delivery system</strong>
          </div>
        </div>
      </section>

      <section className="amw__steps" aria-label="Three maturity levels">
        {MATURITY_LEVELS.map((level, index) => (
          <LevelCard
            key={level.id}
            level={level}
            isLast={index === MATURITY_LEVELS.length - 1}
          />
        ))}
      </section>

      <RevealSurface className="amw__section">
        <section>
          <div className="amw__section-head">
            <div>
              <h3>How the operating model shifts</h3>
              <p>
                Each step changes what the developer spends attention on and what
                the agent system is responsible for.
              </p>
            </div>
          </div>

          <div className="amw__comparison-grid">
            {MATURITY_DIMENSIONS.map((dimension) => (
              <article key={dimension.label} className="amw__comparison-card">
                <h4>{dimension.label}</h4>
                <div className="amw__comparison-values">
                  {dimension.values.map((value, index) => (
                    <div key={`${dimension.label}-${index}`} className="amw__comparison-value">
                      <span className="amw__comparison-step">{index + 1}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </RevealSurface>
    </div>
  );
}
