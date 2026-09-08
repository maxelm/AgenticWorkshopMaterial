import { useMemo, useState } from "react";
import {
  COMMAND_RECIPES,
  CONTROL_LAYERS,
  DOTNET_ARCHITECTURE_OPTIONS,
  EXAMPLE_ROWS,
  HERO_METRICS,
  LEGACY_BOOTSTRAP,
  LOCAL_FIRST_GUIDANCE,
  PERSISTENCE_ZONES,
  SAFETY_NOTES,
  TABS,
  VERIFICATION_LOOP_STAGES,
  VERIFICATION_METRICS,
  VERIFICATION_PILLARS,
} from "./permissionsData.js";
import "./SecurityPermissionsWidget.css";

function ToneColumn({ title, items, tone, emptyLabel }) {
  return (
    <div className={`spw__tone spw__tone--${tone}`}>
      <div className="spw__tone-label">{title}</div>
      {items.length > 0 ? (
        <div className="spw__chip-list">
          {items.map((item) => (
            <span key={item} className="spw__chip">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <div className="spw__tone-empty">{emptyLabel}</div>
      )}
    </div>
  );
}

function CopilotPermissionsTab() {
  const [activeRecipeId, setActiveRecipeId] = useState(COMMAND_RECIPES[0].id);

  const activeRecipe = useMemo(
    () => COMMAND_RECIPES.find((recipe) => recipe.id === activeRecipeId) ?? COMMAND_RECIPES[0],
    [activeRecipeId]
  );

  return (
    <div className="spw__tab-panel">
      <section className="spw__hero">
        <div className="spw__hero-copy">
          <div className="spw__eyebrow">Copilot Permissions</div>
          <h2>Design the tool surface before the agent takes a step.</h2>
          <p>
            GitHub Copilot CLI has a two-layer permission model: first decide
            which tools the model can see, then decide which actions may run
            automatically. The safest sessions feel intentional, not permissive.
          </p>
          <div className="spw__hero-note">
            <strong>Golden rule:</strong> hide tools you already know are out of
            scope, then pre-approve only the smallest set of risky actions you
            actually want.
          </div>
        </div>

        <div className="spw__metric-grid">
          {HERO_METRICS.map((metric) => (
            <article key={metric.kicker} className="spw__metric-card">
              <div className="spw__metric-kicker">{metric.kicker}</div>
              <div className="spw__metric-value">{metric.value}</div>
              <p>{metric.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="spw__section">
        <div className="spw__section-head">
          <div>
            <h3>Two control layers, one safer session</h3>
            <p>
              Think of the model as operating behind two doors: a visibility
              door and an execution door.
            </p>
          </div>
          <div className="spw__precedence">
            <span className="spw__precedence-pill">Deny wins</span>
            <span className="spw__precedence-pill">Allowlist beats denylist</span>
          </div>
        </div>

        <div className="spw__layers">
          {CONTROL_LAYERS.map((layer) => (
            <article
              key={layer.id}
              className="spw__layer-card"
              style={{ "--spw-accent": layer.accent }}
            >
              <div className="spw__layer-step">{layer.step}</div>
              <h4>{layer.title}</h4>
              <div className="spw__flag">{layer.flag}</div>
              <p>{layer.body}</p>
              <ul className="spw__bullet-list">
                {layer.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="spw__section">
        <div className="spw__section-head">
          <div>
            <h3>Where approvals persist</h3>
            <p>
              The docs split saved consent into location-scoped approvals,
              domain-wide URL approvals, and session-only startup flags.
            </p>
          </div>
        </div>

        <div className="spw__persistence-grid">
          {PERSISTENCE_ZONES.map((zone) => (
            <article key={zone.id} className="spw__persistence-card">
              <div className="spw__persistence-topline">
                <span className="spw__storage-badge">{zone.badge}</span>
                <span className="spw__storage-file">{zone.storage}</span>
              </div>
              <h4>{zone.title}</h4>
              <div className="spw__persistence-subtitle">{zone.subtitle}</div>
              <p>{zone.detail}</p>
              <div className="spw__highlight">{zone.highlight}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="spw__section">
        <div className="spw__section-head">
          <div>
            <h3>Permission recipes</h3>
            <p>
              Pick a scenario to see the command, the allowed surface, and the
              blocked edge of the session.
            </p>
          </div>
        </div>

        <div className="spw__recipes">
          <div className="spw__recipe-list" role="tablist" aria-label="Permission recipes">
            {COMMAND_RECIPES.map((recipe) => {
              const isActive = recipe.id === activeRecipe.id;
              return (
                <button
                  key={recipe.id}
                  type="button"
                  className={`spw__recipe-button${isActive ? " spw__recipe-button--active" : ""}`}
                  onClick={() => setActiveRecipeId(recipe.id)}
                  role="tab"
                  aria-selected={isActive}
                >
                  <span className="spw__recipe-title">{recipe.title}</span>
                  <span className="spw__recipe-summary">{recipe.summary}</span>
                </button>
              );
            })}
          </div>

          <article className="spw__recipe-panel">
            <div className="spw__terminal">
              <div className="spw__terminal-bar">
                <span />
                <span />
                <span />
              </div>
              <pre>{`$ ${activeRecipe.command}`}</pre>
            </div>

            <div className="spw__states">
              <ToneColumn
                title="Visible to the model"
                items={activeRecipe.visible}
                tone="visible"
                emptyLabel="No visible tools"
              />
              <ToneColumn
                title="Allowed without prompting"
                items={activeRecipe.allowed}
                tone="allowed"
                emptyLabel="No pre-approved actions"
              />
              <ToneColumn
                title="Still prompts"
                items={activeRecipe.prompt}
                tone="prompt"
                emptyLabel="Nothing else prompts"
              />
              <ToneColumn
                title="Blocked"
                items={activeRecipe.blocked}
                tone="blocked"
                emptyLabel="No explicit denies"
              />
            </div>

            <div className="spw__callout">
              <strong>Why this works:</strong> {activeRecipe.callout}
            </div>
          </article>
        </div>
      </section>

      <section className="spw__section">
        <div className="spw__section-head">
          <div>
            <h3>Examples from the docs, translated into intent</h3>
            <p>
              These patterns are useful because they express policy in human
              terms: analyze only, edit one file, allow git but never push.
            </p>
          </div>
        </div>

        <div className="spw__table-wrap">
          <table className="spw__table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Effect</th>
                <th>Why you would choose it</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLE_ROWS.map((row) => (
                <tr key={row.option}>
                  <td>
                    <code>{row.option}</code>
                  </td>
                  <td>{row.effect}</td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="spw__section spw__section--compact">
        <div className="spw__section-head">
          <div>
            <h3>Practical advice from the page</h3>
          </div>
        </div>
        <div className="spw__notes">
          {SAFETY_NOTES.map((note) => (
            <article key={note.title} className="spw__note-card">
              <h4>{note.title}</h4>
              <p>{note.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function VerificationLoopTab() {
  return (
    <div className="spw__tab-panel">
      <section className="spw__hero spw__hero--verification">
        <div className="spw__hero-copy">
          <div className="spw__eyebrow">Verification Loop</div>
          <h2>Make CI the part of the system that distrusts confident code.</h2>
          <p>
            The agent can move quickly, but merge safety comes from layered
            verification. The loop starts with explicit instructions, continues
            with local runs, and ends with protected CI checks that reject bad
            code before merge.
          </p>
          <div className="spw__hero-note">
            <strong>Instruction to include:</strong> always run the relevant
            tests locally before pushing a new PR or updating an existing one.
          </div>
        </div>

        <div className="spw__metric-grid">
          {VERIFICATION_METRICS.map((metric) => (
            <article key={metric.kicker} className="spw__metric-card">
              <div className="spw__metric-kicker">{metric.kicker}</div>
              <div className="spw__metric-value">{metric.value}</div>
              <p>{metric.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="spw__section">
        <div className="spw__section-head">
          <div>
            <h3>The merge-protection loop</h3>
            <p>
              These stages work best together: instructions shape behavior,
              local runs catch the obvious failures, and CI blocks anything that
              still slips through.
            </p>
          </div>
        </div>

        <div className="spw__loop">
          {VERIFICATION_LOOP_STAGES.map((stage) => (
            <article
              key={stage.id}
              className="spw__loop-card"
              style={{ "--spw-accent": stage.accent }}
            >
              <div className="spw__loop-step">{stage.step}</div>
              <h4>{stage.title}</h4>
              <p>{stage.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="spw__section">
        <div className="spw__section-head">
          <div>
            <h3>Checks that stop bad merges</h3>
            <p>
              Each test type catches a different failure mode. Together they
              create a much more reliable gate than any single suite can.
            </p>
          </div>
        </div>

        <div className="spw__pillars">
          {VERIFICATION_PILLARS.map((pillar) => (
            <article
              key={pillar.id}
              className="spw__pillar-card"
              style={{ "--spw-accent": pillar.accent }}
            >
              <div className="spw__pillar-header">
                <span className="spw__pillar-icon">{pillar.icon}</span>
                <div>
                  <h4>{pillar.title}</h4>
                  <p>{pillar.summary}</p>
                </div>
              </div>
              <ul className="spw__bullet-list">
                {pillar.checks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
              <div className="spw__pillar-catches">
                <strong>What this catches:</strong> {pillar.catches}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="spw__section">
        <div className="spw__section-head">
          <div>
            <h3>.NET architecture-test equivalents to Konsist</h3>
            <p>
              For C#/.NET teams, these are the closest fits when you want
              executable rules around structure, layering, and dependencies.
            </p>
          </div>
        </div>

        <div className="spw__architecture-grid">
          {DOTNET_ARCHITECTURE_OPTIONS.map((option) => (
            <article key={option.name} className="spw__architecture-card">
              <h4>{option.name}</h4>
              <p>{option.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="spw__section">
        <div className="spw__section-head">
          <div>
            <h3>Local-first instructions for agents</h3>
            <p>
              CI should be the final judge, but your instructions should still
              force the agent to validate before it pushes work upstream.
            </p>
          </div>
        </div>

        <div className="spw__guidance-list">
          {LOCAL_FIRST_GUIDANCE.map((item) => (
            <article key={item} className="spw__guidance-card">
              {item}
            </article>
          ))}
        </div>
      </section>

      <section className="spw__section">
        <div className="spw__section-head">
          <div>
            <h3>{LEGACY_BOOTSTRAP.title}</h3>
            <p>{LEGACY_BOOTSTRAP.body}</p>
          </div>
        </div>

        <div className="spw__legacy-panel">
          <div className="spw__legacy-badge">Legacy-friendly rollout</div>
          <ul className="spw__bullet-list">
            {LEGACY_BOOTSTRAP.tactics.map((tactic) => (
              <li key={tactic}>{tactic}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function ComingSoonPanel({ tab }) {
  return (
    <section className="spw__coming-soon">
      <div className="spw__coming-soon-badge">{tab.eyebrow}</div>
      <h2>{tab.label}</h2>
      <p>{tab.description}</p>
      <div className="spw__coming-soon-grid">
        <div className="spw__coming-soon-card">
          Planned focus: clear visual rules, scenario walkthroughs, and
          workshop-friendly command recipes.
        </div>
        <div className="spw__coming-soon-card">
          This tab is scaffolded so the Security &amp; Permissions widget can
          grow into a multi-view dashboard without changing the surrounding UI.
        </div>
      </div>
    </section>
  );
}

export default function SecurityPermissionsWidget() {
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const activeTab = TABS.find((tab) => tab.id === activeTabId) ?? TABS[0];

  return (
    <div className="spw">
      <p className="spw__intro">
        A security-focused dashboard for shaping how Copilot behaves before it
        touches your machine. This first view turns the GitHub Docs guidance on
        tool permissions into a visual operating model with concrete commands.
      </p>

      <div className="spw__tabs" role="tablist" aria-label="Security and permissions views">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`spw__tab${isActive ? " spw__tab--active" : ""}`}
              onClick={() => setActiveTabId(tab.id)}
              role="tab"
              aria-selected={isActive}
            >
              <span className="spw__tab-eyebrow">{tab.eyebrow}</span>
              <span className="spw__tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab.id === "copilot-permissions" ? (
        <CopilotPermissionsTab />
      ) : activeTab.id === "verification-loop" ? (
        <VerificationLoopTab />
      ) : (
        <ComingSoonPanel tab={activeTab} />
      )}
    </div>
  );
}
