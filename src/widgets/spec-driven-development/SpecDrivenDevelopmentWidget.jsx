import {
  BENEFITS,
  COMMAND_FLOW,
  EXTENSIONS,
  GETTING_STARTED,
  HERO_POINTS,
  INSTALL_COMMANDS,
  LIFECYCLE_STEPS,
  PRINCIPLES,
  RESOURCE_LINKS,
  SPECKIT_HIGHLIGHTS,
} from "./specDrivenData.js";
import "./SpecDrivenDevelopmentWidget.css";

function RevealSurface({ className, style, children, as: Component = "div" }) {
  return (
    <Component className={`${className} sddw__reveal-surface`} style={style}>
      <div className="sddw__reveal-content">{children}</div>
    </Component>
  );
}

function ResourceCard({ resource }) {
  return (
    <a
      className="sddw__resource-card"
      href={resource.url}
      target="_blank"
      rel="noreferrer"
    >
      <span className="sddw__resource-title">{resource.title}</span>
      <span className="sddw__resource-description">{resource.description}</span>
    </a>
  );
}

export default function SpecDrivenDevelopmentWidget() {
  return (
    <div className="sddw">
      <section className="sddw__hero">
        <div className="sddw__hero-copy">
          <div className="sddw__eyebrow">Spec-First Workflow</div>
          <h2>Spec-Driven Development keeps AI output anchored to intent.</h2>
          <p>
            The idea is simple: align on requirements, constraints, edge cases,
            and acceptance criteria before asking an agent to sprint ahead.
            Instead of treating prompts as the only source of context, SDD uses
            a durable spec so architecture, implementation, and validation stay
            connected to the same original intent.
          </p>
          <div className="sddw__callout">
            Read the overview in{" "}
            <a
              href="https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering/"
              target="_blank"
              rel="noreferrer"
            >
              Spec-Driven Development: A Spec-First Approach to AI-Native Engineering
            </a>
            .
          </div>
        </div>

        <div className="sddw__hero-points">
          {HERO_POINTS.map((point) => (
            <article key={point.label} className="sddw__hero-card">
              <div className="sddw__hero-label">{point.label}</div>
              <strong>{point.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <RevealSurface
        className="sddw__section"
        as="section"
      >
        <div className="sddw__section-head">
          <div>
            <h3>What changes in practice</h3>
            <p>
              SDD shifts effort earlier in the lifecycle so teams lose less time
              later to interpretation errors and implementation drift.
            </p>
          </div>
        </div>

        <div className="sddw__principles">
          {PRINCIPLES.map((principle) => (
            <article key={principle.title} className="sddw__card">
              <h4>{principle.title}</h4>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>

        <div className="sddw__benefits">
          <div className="sddw__benefits-title">Why teams adopt it</div>
          <ul className="sddw__bullet-list">
            {BENEFITS.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
      </RevealSurface>

      <RevealSurface
        className="sddw__section"
        as="section"
      >
        <div className="sddw__section-head">
          <div>
            <h3>The lifecycle</h3>
            <p>
              The Microsoft overview frames SDD as a chain of reinforcing steps:
              define intent, remove ambiguity, plan with constraints, implement
              with AI, and validate against the spec.
            </p>
          </div>
        </div>

        <div className="sddw__lifecycle">
          {LIFECYCLE_STEPS.map((step) => (
            <article
              key={step.step}
              className="sddw__step-card"
              style={{ "--sddw-accent": step.accent }}
            >
                <span className="sddw__step-badge">{step.step}</span>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
            </article>
          ))}
        </div>
      </RevealSurface>

      <RevealSurface
        className="sddw__section"
        as="section"
      >
        <div className="sddw__section-head">
          <div>
            <h3>How GitHub Spec Kit operationalizes it</h3>
            <p>
              GitHub Spec Kit turns the general SDD idea into a concrete toolkit
              you can run with an AI coding agent.
            </p>
          </div>
          <a
            className="sddw__section-link"
            href="https://github.com/github/spec-kit"
            target="_blank"
            rel="noreferrer"
          >
            View github/spec-kit
          </a>
        </div>

        <div className="sddw__grid">
          {SPECKIT_HIGHLIGHTS.map((highlight) => (
            <article key={highlight.title} className="sddw__card">
              <h4>{highlight.title}</h4>
              <p>{highlight.body}</p>
            </article>
          ))}
        </div>

        <div className="sddw__kit-layout">
          <article className="sddw__panel">
            <div className="sddw__panel-kicker">Quickstart</div>
            <h4>Install and initialize the toolkit</h4>
            <p>
              Spec Kit ships as a CLI. A minimal GitHub Copilot-oriented setup
              looks like this:
            </p>
            <div className="sddw__terminal">
              <div className="sddw__terminal-bar">
                <span />
                <span />
                <span />
              </div>
              <pre>{INSTALL_COMMANDS.join("\n")}</pre>
            </div>
          </article>

          <article className="sddw__panel">
            <div className="sddw__panel-kicker">Core flow</div>
            <div className="sddw__command-list">
              {COMMAND_FLOW.map((item) => (
                <div key={item.command} className="sddw__command-card">
                  <code>{item.command}</code>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="sddw__extensions">
          {EXTENSIONS.map((extension) => (
            <article key={extension.name} className="sddw__extension-card">
              <div className="sddw__extension-name">{extension.name}</div>
              <div className="sddw__extension-flow">{extension.flow}</div>
              <p>{extension.body}</p>
            </article>
          ))}
        </div>
      </RevealSurface>

      <RevealSurface
        className="sddw__section"
        as="section"
      >
        <div className="sddw__section-head">
          <div>
            <h3>How to get started without overdoing it</h3>
            <p>
              A full spec lifecycle is most valuable when coordination costs are
              real. Start with a focused pilot, then expand only where the extra
              structure pays for itself.
            </p>
          </div>
        </div>

        <div className="sddw__grid">
          {GETTING_STARTED.map((item, index) => (
            <article key={item.title} className="sddw__card">
              <div className="sddw__numbered-badge">{index + 1}</div>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </RevealSurface>

      <RevealSurface
        className="sddw__section"
        as="section"
      >
        <div className="sddw__section-head">
          <div>
            <h3>Read more</h3>
            <p>
              These are the two primary references behind this widget, plus the
              main docs and release feed for deeper exploration.
            </p>
          </div>
        </div>

        <div className="sddw__resources">
          {RESOURCE_LINKS.map((resource) => (
            <ResourceCard key={resource.url} resource={resource} />
          ))}
        </div>
      </RevealSurface>
    </div>
  );
}
