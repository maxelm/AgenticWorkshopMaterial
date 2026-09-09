import {
  COMPARISON_ROWS,
  LAYER_STEPS,
  PROTOCOLS,
  SCENARIOS,
} from "./protocolData.js";
import "./AgentProtocolsWidget.css";

function ProtocolCard({ protocol }) {
  return (
    <article
      className="apw__protocol-card"
      style={{ "--apw-accent": protocol.accent }}
    >
      <div className="apw__protocol-topline">
        <span className="apw__badge">{protocol.shortLabel}</span>
        <a href={protocol.sourceUrl} target="_blank" rel="noreferrer">
          {protocol.sourceLabel}
        </a>
      </div>
      <h3>{protocol.name}</h3>
      <p className="apw__one-liner">{protocol.oneLiner}</p>
      <ul className="apw__bullet-list">
        {protocol.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </article>
  );
}

export default function AgentProtocolsWidget() {
  return (
    <div className="apw">
      <section className="apw__hero">
        <div className="apw__hero-copy">
          <div className="apw__eyebrow">Agent Interoperability Map</div>
          <h2>MCP, Agent Skills, and A2A solve different layers of the same stack.</h2>
          <p>
            They are complementary, not competing. MCP gives an agent access to
            tools and data, Agent Skills give it packaged expertise, and A2A
            gives it a standard way to collaborate with other agents.
          </p>
        </div>

        <div className="apw__hero-summary">
          <div className="apw__summary-line">
            <span>MCP</span>
            <strong>tool and context connectivity</strong>
          </div>
          <div className="apw__summary-line">
            <span>Skills</span>
            <strong>reusable know-how</strong>
          </div>
          <div className="apw__summary-line">
            <span>A2A</span>
            <strong>agent-to-agent delegation</strong>
          </div>
        </div>
      </section>

      <section className="apw__protocol-grid" aria-label="Protocol overview cards">
        {PROTOCOLS.map((protocol) => (
          <ProtocolCard key={protocol.id} protocol={protocol} />
        ))}
      </section>

      <section className="apw__section">
        <div className="apw__section-head">
          <div>
            <h3>Quick comparison</h3>
            <p>
              The easiest way to distinguish them is to ask what kind of thing
              is being connected: a tool, a playbook, or another agent.
            </p>
          </div>
        </div>

        <div className="apw__table-wrap">
          <table className="apw__table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>MCP</th>
                <th>Agent Skills</th>
                <th>A2A</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.dimension}>
                  <th scope="row">{row.dimension}</th>
                  <td>{row.mcp}</td>
                  <td>{row.skills}</td>
                  <td>{row.a2a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="apw__section">
        <div className="apw__section-head">
          <div>
            <h3>How they fit together</h3>
            <p>
              In practice, a strong agent experience often uses all three at
              once because they operate at different layers.
            </p>
          </div>
        </div>

        <div className="apw__flow">
          {LAYER_STEPS.map((step) => (
            <article
              key={step.id}
              className="apw__flow-card"
              style={step.accent ? { "--apw-accent": step.accent } : undefined}
            >
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="apw__section">
        <div className="apw__section-head">
          <div>
            <h3>When to reach for each one</h3>
            <p>
              Pick the mechanism that matches the missing capability, then layer
              the others only if the workflow needs them.
            </p>
          </div>
        </div>

        <div className="apw__scenario-list">
          {SCENARIOS.map((scenario) => (
            <article key={scenario.need} className="apw__scenario-card">
              <div className="apw__scenario-need">{scenario.need}</div>
              <div className="apw__scenario-answer">{scenario.answer}</div>
              <p>{scenario.why}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="apw__note" aria-label="CLI versus MCP note">
        <h3>Why many tool integrations now skip MCP</h3>
        <p>
          In coding agents, direct CLI access often replaces what would have
          been an MCP integration a year earlier. If the agent can already run{" "}
          <code>git</code>, <code>gh</code>, <code>npm</code>, <code>docker</code>,{" "}
          <code>curl</code>, or cloud CLIs, it can often inspect systems and take
          actions without needing a separate MCP server for each tool.
        </p>
        <p>
          That does not make MCP obsolete. MCP still matters when you want a
          cleaner cross-client contract, richer structured tool metadata, safer
          scoped access, or integrations for apps that are not naturally exposed
          through a local shell. But for many developer workflows, the command
          line has become the default integration surface.
        </p>
      </section>
    </div>
  );
}
