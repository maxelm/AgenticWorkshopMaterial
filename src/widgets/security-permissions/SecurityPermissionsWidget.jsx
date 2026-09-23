import { useMemo, useState } from "react";
import {
  AZURE_DEVOPS_REVIEW_EXAMPLE,
  CODE_REVIEW_CUSTOMIZATION,
  CODE_REVIEW_FLOW,
  CODE_REVIEW_METRICS,
  CODE_REVIEW_NOTES,
  CODE_REVIEW_PILLARS,
  CODE_REVIEW_RESOURCES,
  COMMAND_RECIPES,
  CONTROL_LAYERS,
  DOTNET_ARCHITECTURE_OPTIONS,
  EXAMPLE_ROWS,
  HERO_METRICS,
  OFFICIAL_RESOURCES,
  PERSISTENCE_ZONES,
  SAFETY_NOTES,
  SESSION_COMMANDS,
  TABS,
  VERIFICATION_LOOP_STAGES,
  VERIFICATION_METRICS,
  VERIFICATION_NOTES,
  VERIFICATION_PILLARS,
  VERIFICATION_STACK_ROWS,
} from "./permissionsData.js";
import "./SecurityPermissionsWidget.css";

function RevealSurface({ className, style, children, as: Component = "div" }) {
  return (
    <Component className={`${className} spw__reveal-surface`} style={style}>
      <div className="spw__reveal-content">{children}</div>
    </Component>
  );
}

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
      <RevealSurface
        className="spw__hero spw__hero--left-metrics"
        as="section"
      >
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
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
        <div className="spw__section-head">
          <div>
            <h3>Official docs and fast resets</h3>
            <p>
              Keep the canonical GitHub docs nearby for exact syntax, and keep
              the highest-impact slash commands close for live sessions.
            </p>
          </div>
        </div>

        <div className="spw__reference-grid">
          <article className="spw__reference-card">
            <div className="spw__reference-kicker">Official documentation</div>
            <h4>GitHub Docs</h4>
            <p>
              The docs are the source of truth for permission patterns,
              precedence rules, persistence, and the difference between
              session-only and saved approvals.
            </p>
            <div className="spw__resource-list">
              {OFFICIAL_RESOURCES.map((resource) => (
                <a
                  key={resource.url}
                  className="spw__resource-link"
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="spw__resource-title">{resource.title}</span>
                  <span className="spw__resource-description">{resource.description}</span>
                </a>
              ))}
            </div>
          </article>

          <article className="spw__reference-card">
            <div className="spw__reference-kicker">In-session controls</div>
            <h4>Slash commands worth remembering</h4>
            <p>
              The docs call out two shortcuts that matter most in workshops:
              one to open everything up temporarily, and one to unwind those
              decisions cleanly.
            </p>
            <div className="spw__session-command-list">
              {SESSION_COMMANDS.map((item) => (
                <article key={item.command} className="spw__session-command-card">
                  <code>{item.command}</code>
                  <p>{item.effect}</p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
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
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
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
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
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
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
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
      </RevealSurface>

      <RevealSurface
        className="spw__section spw__section--compact"
        as="section"
      >
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
      </RevealSurface>
    </div>
  );
}

function CodeReviewAgentTab() {
  return (
    <div className="spw__tab-panel">
      <RevealSurface
        className="spw__hero spw__hero--review spw__hero--left-metrics"
        as="section"
      >
        <div className="spw__hero-copy">
          <div className="spw__eyebrow">Code Review Agent</div>
          <h2>Put an AI reviewer inside the pull request loop, not beside it.</h2>
          <p>
            GitHub Copilot code review improves CI/CD by reviewing pull
            requests in the same workflow your team already uses. That matters
            even more for LLM-generated code, where plausible output can still
            hide subtle bugs, weak validation, or risky assumptions.
          </p>
          <div className="spw__hero-note">
            <strong>Why this helps:</strong> fast generated code benefits from a
            fast second reader that can surface issues before human reviewers
            spend time untangling them.
          </div>
        </div>

        <div className="spw__metric-grid">
          {CODE_REVIEW_METRICS.map((metric) => (
            <article key={metric.kicker} className="spw__metric-card">
              <div className="spw__metric-kicker">{metric.kicker}</div>
              <div className="spw__metric-value">{metric.value}</div>
              <p>{metric.detail}</p>
            </article>
          ))}
        </div>
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
        <div className="spw__section-head">
          <div>
            <h3>How it fits into CI/CD</h3>
            <p>
              The docs describe Copilot code review as an agentic capability
              powered by GitHub Actions, which makes it a natural PR gate and
              feedback loop inside automated delivery.
            </p>
          </div>
        </div>

        <div className="spw__loop">
          {CODE_REVIEW_FLOW.map((stage) => (
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
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
        <div className="spw__section-head">
          <div>
            <h3>Why it is useful for LLM-generated code</h3>
            <p>
              Generated code often fails in ways that are not obvious from a
              quick skim. The review agent is most valuable when it adds signal
              before merge, not when it merely repeats lint output.
            </p>
          </div>
        </div>

        <div className="spw__pillars">
          {CODE_REVIEW_PILLARS.map((pillar) => (
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
                <strong>What this improves:</strong> {pillar.catches}
              </div>
            </article>
          ))}
        </div>
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
        <div className="spw__section-head">
          <div>
            <h3>Customize the reviewer, not just the code generator</h3>
            <p>
              The best review quality comes from teaching Copilot how your
              repository works and shaping the environment it runs in.
            </p>
          </div>
        </div>

        <div className="spw__architecture-grid">
          {CODE_REVIEW_CUSTOMIZATION.map((option) => (
            <article key={option.name} className="spw__architecture-card">
              <h4>{option.name}</h4>
              <p>{option.summary}</p>
            </article>
          ))}
        </div>
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
        <div className="spw__section-head">
          <div>
            <h3>{AZURE_DEVOPS_REVIEW_EXAMPLE.title}</h3>
            <p>{AZURE_DEVOPS_REVIEW_EXAMPLE.intro}</p>
          </div>
        </div>

        <article className="spw__recipe-panel">
          <div className="spw__terminal">
            <div className="spw__terminal-bar">
              <span />
              <span />
              <span />
            </div>
            <pre>{AZURE_DEVOPS_REVIEW_EXAMPLE.script}</pre>
          </div>

          <div className="spw__callout">
            <strong>Important:</strong> {AZURE_DEVOPS_REVIEW_EXAMPLE.note}
          </div>

          <ul className="spw__bullet-list">
            {AZURE_DEVOPS_REVIEW_EXAMPLE.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </article>
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
        <div className="spw__section-head">
          <div>
            <h3>Docs to keep handy</h3>
            <p>
              These references cover the review workflow itself, automatic
              review rules, and the broader review model.
            </p>
          </div>
        </div>

        <div className="spw__reference-grid">
          {CODE_REVIEW_RESOURCES.map((resource) => (
            <a
              key={resource.url}
              className="spw__resource-link"
              href={resource.url}
              target="_blank"
              rel="noreferrer"
            >
              <span className="spw__resource-title">{resource.title}</span>
              <span className="spw__resource-description">{resource.description}</span>
            </a>
          ))}
        </div>
      </RevealSurface>

      <RevealSurface
        className="spw__section spw__section--compact"
        as="section"
      >
        <div className="spw__section-head">
          <div>
            <h3>Practical caveats</h3>
          </div>
        </div>
        <div className="spw__notes">
          {CODE_REVIEW_NOTES.map((note) => (
            <article key={note.title} className="spw__note-card">
              <h4>{note.title}</h4>
              <p>{note.body}</p>
            </article>
          ))}
        </div>
      </RevealSurface>
    </div>
  );
}

function VerificationLoopTab() {
  return (
    <div className="spw__tab-panel">
      <RevealSurface
        className="spw__section"
        as="section"
      >
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
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
        <div className="spw__section-head">
          <div>
            <h3>What each test category enforces</h3>
            <p>
              Each layer closes a different failure mode: missing tests,
              untested permutations, broken user journeys, or code landing in
              the wrong architectural layer.
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
                <strong>What this blocks:</strong> {pillar.catches}
              </div>
            </article>
          ))}
        </div>
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
        <div className="spw__section-head">
          <div>
            <h3>Recommended tooling in the PR gate</h3>
            <p>
              The gate should show missing tests, prove the real UI, and reject
              structural shortcuts. Keep the tooling visible in the PR so both
              the agent and reviewers can act on it.
            </p>
          </div>
        </div>

        <div className="spw__table-wrap">
          <table className="spw__table">
            <thead>
              <tr>
                <th>PR gate</th>
                <th>Requirement</th>
                <th>Tooling</th>
                <th>Why it belongs</th>
              </tr>
            </thead>
            <tbody>
              {VERIFICATION_STACK_ROWS.map((row) => (
                <tr key={row.layer}>
                  <td>{row.layer}</td>
                  <td>{row.requirement}</td>
                  <td>{row.tooling}</td>
                  <td>{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealSurface>

      <RevealSurface
        className="spw__section"
        as="section"
      >
        <div className="spw__section-head">
          <div>
            <h3>Architecture test options for .NET teams</h3>
            <p>
              For .NET applications, these are the architecture-testing tools
              to wire into the same PR loop as behavior and UI checks.
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
      </RevealSurface>

      <RevealSurface
        className="spw__section spw__section--compact"
        as="section"
      >
        <div className="spw__section-head">
          <div>
            <h3>Practical rules for the new tab</h3>
          </div>
        </div>
        <div className="spw__notes">
          {VERIFICATION_NOTES.map((note) => (
            <article key={note.title} className="spw__note-card">
              <h4>{note.title}</h4>
              <p>{note.body}</p>
            </article>
          ))}
        </div>
      </RevealSurface>
    </div>
  );
}

export default function SecurityPermissionsWidget() {
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const activeTab = TABS.find((tab) => tab.id === activeTabId) ?? TABS[0];

  return (
    <div className="spw">
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
      ) : activeTab.id === "code-review-agent" ? (
        <CodeReviewAgentTab />
      ) : (
        <VerificationLoopTab />
      )}
    </div>
  );
}
