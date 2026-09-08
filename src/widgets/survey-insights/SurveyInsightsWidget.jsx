import { useMemo, useState } from "react";
import {
  arc as createArc,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  groups,
  hierarchy,
  pack,
  partition,
  rollup,
  rollups,
} from "d3";
import {
  CONCERN_COUNTS,
  OPEN_FEEDBACK,
  OUTCOME_COUNTS,
  QUESTION_THEMES,
  RESPONDENTS,
  VALUE_COUNTS,
} from "./surveyData.js";
import "./SurveyInsightsWidget.css";

const TOTAL_RESPONDENTS = RESPONDENTS.length;

const SENTIMENT_META = {
  ready: {
    title: "Ready to pilot",
    subtitle: "High usage, higher confidence, comfortable with stronger autonomy",
    color: "#2563eb",
  },
  cautious: {
    title: "Curious but cautious",
    subtitle: "Positive interest, but still wants human checkpoints and clearer proof",
    color: "#8b5cf6",
  },
  clarity: {
    title: "Needs clarity first",
    subtitle: "Lower confidence or unclear autonomy comfort, so guardrails come first",
    color: "#f97316",
  },
};

const ROLE_SHORT = {
  "Software developer / engineer": "Engineers",
  "Technical lead / architect": "Tech leads",
  "Product owner / product manager": "Product",
  "Quality assurance / tester": "QA",
  "Scrum master / agile coach": "Scrum",
};

const TRACK_SHORT = {
  "Hands-on technical track": "Hands-on",
  "Product, leadership, and operating-model track": "Leadership",
  "A blended track for mixed roles": "Blended",
  "Not sure": "Not sure",
};

const USAGE_SCORE = {
  Daily: 1.35,
  "Several times a week": 1.05,
  Rarely: 0.45,
  Never: 0,
};

const AUTONOMY_SCORE = {
  "Suggestions only; a person accepts changes line by line": 0.3,
  "The agent proposes edits; a person approves each edit": 0.85,
  "The agent edits files; a person reviews the full diff before committing": 1.05,
  "The agent runs commands and tests; a person reviews the result": 1.25,
  "I don't know": 0.15,
};

function classifySentiment(respondent) {
  const score =
    (USAGE_SCORE[respondent.aiUsage] ?? 0) +
    (AUTONOMY_SCORE[respondent.autonomy] ?? 0) +
    respondent.confidence * 0.45;

  if (score >= 3.45) return "ready";
  if (score >= 2.25) return "cautious";
  return "clarity";
}

function summarizeArc(node) {
  const count = node.value ?? TOTAL_RESPONDENTS;
  const share = Math.round((count / TOTAL_RESPONDENTS) * 100);
  const path = node
    .ancestors()
    .reverse()
    .slice(1)
    .map((item) => item.data.name)
    .join(" → ");

  if (node.depth === 0) {
    return {
      title: "All respondents",
      subtitle: `${TOTAL_RESPONDENTS} people answered the survey`,
      body:
        "This view groups respondents into derived readiness sentiment, then breaks each segment down by role and preferred workshop track.",
      share: "100%",
      count,
      path: "Survey",
    };
  }

  if (node.depth === 1) {
    const meta = SENTIMENT_META[node.data.sentimentId];
    return {
      title: node.data.name,
      subtitle: meta.subtitle,
      body:
        "This sentiment is derived from three survey signals: current AI usage, self-rated confidence, and the highest autonomy level each person is comfortable with today.",
      share: `${share}%`,
      count,
      path,
    };
  }

  if (node.depth === 2) {
    return {
      title: node.data.name,
      subtitle: "Role slice inside the current sentiment band",
      body:
        "This shows which roles dominate the selected sentiment segment and helps you tailor examples accordingly.",
      share: `${share}%`,
      count,
      path,
    };
  }

  return {
    title: node.data.name,
    subtitle: "Preferred workshop track inside that role slice",
    body:
      "The outer ring shows what kind of session format each role leans toward once you account for its current confidence and comfort with agents.",
    share: `${share}%`,
    count,
    path,
  };
}

function sentimentOfNode(node) {
  const band = node.ancestors().find((item) => item.depth === 1);
  return band?.data.sentimentId ?? "cautious";
}

function buildSentimentHierarchy() {
  const enriched = RESPONDENTS.map((respondent) => ({
    ...respondent,
    sentimentId: classifySentiment(respondent),
  }));

  return {
    name: "Survey",
    children: groups(enriched, (item) => item.sentimentId).map(([sentimentId, items]) => ({
      name: SENTIMENT_META[sentimentId].title,
      sentimentId,
      children: groups(items, (item) => item.role).map(([role, roleItems]) => ({
        name: ROLE_SHORT[role] ?? role,
        role,
        children: rollups(roleItems, (values) => values.length, (item) => item.track)
          .map(([track, count]) => ({
            name: TRACK_SHORT[track] ?? track,
            track,
            value: count,
          })),
      })),
    })),
  };
}

function useSunburstLayout() {
  return useMemo(() => {
    const root = hierarchy(buildSentimentHierarchy())
      .sum((item) => item.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const radius = 170;
    const partitionLayout = partition().size([2 * Math.PI, radius]);
    const laidOut = partitionLayout(root);
    const arc = createArc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle(0.01)
      .padRadius(radius * 0.6)
      .innerRadius((d) => d.y0 + 8)
      .outerRadius((d) => Math.max(d.y0 + 8, d.y1 - 4));

    const nodes = laidOut.descendants().filter((item) => item.depth > 0);
    return { root: laidOut, nodes, arc, radius };
  }, []);
}

function splitLabel(label, maxChars = 15) {
  const words = label.split(" ");
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) current = next;
    else {
      if (current) lines.push(current);
      current = word;
    }
  });

  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function arcLabelVisible(node) {
  return node.depth > 0 && node.y1 - node.y0 > 22 && node.x1 - node.x0 > 0.22;
}

function arcLabelTransform(node, lift = 0) {
  const angle = ((node.x0 + node.x1) / 2) * (180 / Math.PI) - 90;
  const radius = (node.y0 + node.y1) / 2 + 2 + lift;
  return `rotate(${angle}) translate(${radius},0) rotate(${angle < 180 ? 0 : 180})`;
}

function SummaryCard({ eyebrow, value, detail, accentClass }) {
  return (
    <div className={`survey__summary-card ${accentClass ?? ""}`}>
      <div className="survey__summary-eyebrow">{eyebrow}</div>
      <div className="survey__summary-value">{value}</div>
      <div className="survey__summary-detail">{detail}</div>
    </div>
  );
}

function SentimentSunburst() {
  const { root, nodes, arc } = useSunburstLayout();
  const [activeNode, setActiveNode] = useState(root);
  const summary = summarizeArc(activeNode);

  return (
    <section className="survey__card survey__card--hero">
      <div className="survey__section-head">
        <div>
          <h2>Adoption sentiment</h2>
          <p>
            A D3 sunburst showing how readiness breaks down by role and preferred
            workshop format.
          </p>
        </div>
        <div className="survey__legend">
          {Object.entries(SENTIMENT_META).map(([id, meta]) => (
            <span key={id} className="survey__legend-item">
              <span
                className="survey__legend-dot"
                style={{ backgroundColor: meta.color }}
              />
              {meta.title}
            </span>
          ))}
        </div>
      </div>

      <div className="survey__sunburst-layout">
        <svg
          viewBox="-210 -210 420 420"
          className="survey__sunburst"
          role="img"
          onMouseLeave={() => setActiveNode(root)}
        >
          <defs>
            <filter id="surveyGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle className="survey__sunburst-core" r={62} />

          {nodes.map((node) => {
            const meta = SENTIMENT_META[sentimentOfNode(node)];
            const isActive =
              activeNode === node || activeNode.ancestors().includes(node) || node.ancestors().includes(activeNode);

            return (
              <path
                key={`${node.depth}-${node.data.name}-${node.x0}`}
                d={arc(node)}
                className={`survey__sunburst-arc ${isActive ? "survey__sunburst-arc--active" : ""}`}
                fill={meta.color}
                fillOpacity={node.depth === 1 ? 0.88 : node.depth === 2 ? 0.7 : 0.52}
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
                filter={isActive ? "url(#surveyGlow)" : undefined}
                onMouseEnter={() => setActiveNode(node)}
                onFocus={() => setActiveNode(node)}
              >
                <title>{`${node.data.name}: ${node.value}`}</title>
              </path>
            );
          })}

          <text className="survey__sunburst-center-value" textAnchor="middle" y="-4">
            {TOTAL_RESPONDENTS}
          </text>
          <text className="survey__sunburst-center-label" textAnchor="middle" y="18">
            respondents
          </text>

          {nodes.filter(arcLabelVisible).map((node) => {
            const isHovered = activeNode === node;

            return (
              <text
                key={`label-${node.depth}-${node.data.name}-${node.x0}`}
                transform={arcLabelTransform(node, isHovered ? 10 : 0)}
                className={`survey__sunburst-label ${
                  isHovered ? "survey__sunburst-label--active" : ""
                }`}
                textAnchor={((node.x0 + node.x1) / 2) * (180 / Math.PI) < 180 ? "start" : "end"}
              >
                {splitLabel(node.data.name, node.depth === 3 ? 12 : 16).map((line, index) => (
                  <tspan key={line} x="0" dy={index === 0 ? "0" : "1.05em"}>
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
        </svg>

        <aside className="survey__insight-panel">
          <div className="survey__insight-kicker">Derived reading</div>
          <h3>{summary.title}</h3>
          <p className="survey__insight-subtitle">{summary.subtitle}</p>
          <div className="survey__insight-metrics">
            <div>
              <span>Share</span>
              <strong>{summary.share}</strong>
            </div>
            <div>
              <span>People</span>
              <strong>{summary.count}</strong>
            </div>
          </div>
          <p>{summary.body}</p>
          <div className="survey__insight-path">{summary.path}</div>
          <p className="survey__method-note">
            Sentiment here is workshop-readiness sentiment, not NLP sentiment.
            It is derived from AI usage frequency, confidence, and autonomy
            comfort signals in the survey.
          </p>
        </aside>
      </div>
    </section>
  );
}

function PackChart({ title, items, hue, description }) {
  const [activeLabel, setActiveLabel] = useState(null);
  const layout = useMemo(() => {
    const root = pack()
      .size([360, 280])
      .padding(10)(
        hierarchy({ children: items })
          .sum((item) => item.value)
          .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
      );

    return root.leaves();
  }, [items]);

  return (
    <section className="survey__card survey__card--pack">
      <div className="survey__section-head survey__section-head--stacked">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <svg viewBox="0 0 360 280" className="survey__pack-chart" role="img">
        {layout.map((leaf, index) => {
          const opacity = 0.94 - index * 0.05;
          return (
            <g
              key={leaf.data.label}
              transform={`translate(${leaf.x},${leaf.y})`}
              onMouseEnter={() =>
                setActiveLabel({
                  label: leaf.data.label,
                  value: leaf.data.value,
                  x: leaf.x,
                  y: leaf.y,
                  r: leaf.r,
                })
              }
              onMouseLeave={() => setActiveLabel(null)}
            >
              <circle
                r={leaf.r}
                fill={hue}
                fillOpacity={Math.max(0.26, opacity)}
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
              >
                <title>{`${leaf.data.label}: ${leaf.data.value}`}</title>
              </circle>
            </g>
          );
        })}

        {activeLabel && (
          <g
            className="survey__pack-hover-label"
            transform={`translate(${activeLabel.x},${Math.max(
              22,
              activeLabel.y - activeLabel.r - 10
            )})`}
          >
            <text className="survey__pack-hover-text" textAnchor="middle">
              {splitLabel(
                activeLabel.label,
                activeLabel.r > 55 ? 18 : activeLabel.r > 34 ? 15 : 13
              ).map((line, lineIndex) => (
                <tspan key={line} x="0" dy={lineIndex === 0 ? "0" : "1.05em"}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        )}
      </svg>
    </section>
  );
}

function QuestionClusterExplorer() {
  const themeCounts = useMemo(() => {
    const counts = rollup(OPEN_FEEDBACK, (items) => items.length, (item) => item.themeId);
    return QUESTION_THEMES.map((theme) => ({
      ...theme,
      count: counts.get(theme.id) ?? 0,
    }));
  }, []);

  const [expandedThemeId, setExpandedThemeId] = useState("guardrails");
  const [selectedNoteId, setSelectedNoteId] = useState("eng-policies");
  const [hoveredNode, setHoveredNode] = useState(null);

  const visibleNotes = useMemo(
    () => OPEN_FEEDBACK.filter((item) => item.themeId === expandedThemeId),
    [expandedThemeId]
  );

  const selectedNote =
    visibleNotes.find((item) => item.id === selectedNoteId) ?? visibleNotes[0] ?? null;

  const layout = useMemo(() => {
    const width = 660;
    const height = 420;
    const clusterRadius = 138;
    const centerX = width / 2;
    const centerY = height / 2;

    const clusterNodes = themeCounts.map((theme, index) => {
      const angle = (index / themeCounts.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...theme,
        type: "theme",
        r: 28 + theme.count * 3.6,
        x: centerX + Math.cos(angle) * clusterRadius,
        y: centerY + Math.sin(angle) * clusterRadius,
      };
    });

    const noteNodes = OPEN_FEEDBACK.filter((item) => item.themeId === expandedThemeId).map((item) => ({
      ...item,
      type: "note",
      r: 24,
    }));

    const nodes = [...clusterNodes, ...noteNodes];
    const links = noteNodes.map((item) => ({
      source: expandedThemeId,
      target: item.id,
    }));

    const anchors = new Map(clusterNodes.map((node) => [node.id, { x: node.x, y: node.y }]));
    const activeAnchor = anchors.get(expandedThemeId) ?? { x: centerX, y: centerY };

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink(links)
          .id((item) => item.id)
          .distance(92)
          .strength(0.65)
      )
      .force(
        "charge",
        forceManyBody().strength((item) => (item.type === "theme" ? -560 : -180))
      )
      .force("collide", forceCollide().radius((item) => item.r + 6).iterations(2))
      .force(
        "x",
        forceX((item) => {
          if (item.type === "theme") return anchors.get(item.id)?.x ?? centerX;
          return activeAnchor.x;
        })
          .strength((item) => (item.type === "theme" ? 0.9 : 0.14))
      )
      .force(
        "y",
        forceY((item) => {
          if (item.type === "theme") return anchors.get(item.id)?.y ?? centerY;
          return activeAnchor.y;
        })
          .strength((item) => (item.type === "theme" ? 0.9 : 0.14))
      )
      .stop();

    for (let i = 0; i < 260; i += 1) simulation.tick();

    return {
      nodes: nodes.map((item) => ({ ...item })),
      links: links.map((link) => ({
        source: typeof link.source === "object" ? link.source.id : link.source,
        target: typeof link.target === "object" ? link.target.id : link.target,
      })),
    };
  }, [expandedThemeId, themeCounts]);

  const nodeMap = useMemo(
    () => new Map(layout.nodes.map((item) => [item.id, item])),
    [layout.nodes]
  );

  const expandedTheme = themeCounts.find((item) => item.id === expandedThemeId);

  return (
    <section className="survey__card survey__card--clusters">
      <div className="survey__section-head">
        <div>
          <h2>Questions and written feedback</h2>
          <p>
            A force-directed cluster map. Click a theme to expand the comments
            inside it.
          </p>
        </div>
        <div className="survey__theme-pills">
          {themeCounts.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={`survey__theme-pill ${
                theme.id === expandedThemeId ? "survey__theme-pill--active" : ""
              }`}
              style={{
                "--theme-color": theme.color,
              }}
              onClick={() => {
                setExpandedThemeId(theme.id);
                const nextNote = OPEN_FEEDBACK.find((item) => item.themeId === theme.id);
                setSelectedNoteId(nextNote?.id ?? "");
              }}
            >
              {theme.title} <span>{theme.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="survey__cluster-layout">
        <svg viewBox="0 -72 660 500" className="survey__cluster-chart" role="img">
          {layout.links.map((link) => {
            const source = nodeMap.get(link.source);
            const target = nodeMap.get(link.target);
            if (!source || !target) return null;

            return (
              <line
                key={`${link.source}-${link.target}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className="survey__cluster-link"
              />
            );
          })}

          {layout.nodes.map((node) => {
            const isTheme = node.type === "theme";
            const isExpanded = isTheme && node.id === expandedThemeId;
            const isSelected = !isTheme && node.id === selectedNoteId;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                className="survey__cluster-node"
                onMouseEnter={() =>
                  setHoveredNode({
                    id: node.id,
                    label: node.title,
                    meta: isTheme ? `${node.count} notes` : node.kind,
                    x: node.x,
                    y: node.y,
                    r: node.r,
                  })
                }
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => {
                  if (isTheme) {
                    setExpandedThemeId(node.id);
                    const nextNote = OPEN_FEEDBACK.find((item) => item.themeId === node.id);
                    setSelectedNoteId(nextNote?.id ?? "");
                  } else {
                    setSelectedNoteId(node.id);
                  }
                }}
              >
                <circle
                  r={node.r}
                  fill={node.color}
                  fillOpacity={isTheme ? (isExpanded ? 0.9 : 0.72) : isSelected ? 0.9 : 0.78}
                  className={isSelected ? "survey__cluster-circle--selected" : ""}
                />
              </g>
            );
          })}

          {hoveredNode && (
            <g
              className="survey__cluster-hover-label"
              transform={`translate(${hoveredNode.x},${Math.max(
                24,
                hoveredNode.y - hoveredNode.r - 12
              )})`}
            >
              <text className="survey__cluster-hover-text" textAnchor="middle">
                {splitLabel(
                  hoveredNode.label,
                  hoveredNode.r > 42 ? 16 : hoveredNode.r > 28 ? 14 : 12
                ).map((line, index) => (
                  <tspan key={line} x="0" dy={index === 0 ? "0" : "1.05em"}>
                    {line}
                  </tspan>
                ))}
                <tspan x="0" dy="1.1em" className="survey__cluster-hover-meta">
                  {hoveredNode.meta}
                </tspan>
              </text>
            </g>
          )}
        </svg>

        <aside className="survey__cluster-details">
          {expandedTheme && (
            <>
              <div className="survey__insight-kicker">Expanded cluster</div>
              <h3>{expandedTheme.title}</h3>
              <p className="survey__cluster-summary">{expandedTheme.description}</p>
            </>
          )}

          {selectedNote ? (
            <div className="survey__quote-card">
              <div className="survey__quote-meta">
                <span>{selectedNote.role}</span>
                <span>{selectedNote.kind}</span>
              </div>
              <h4>{selectedNote.title}</h4>
              <blockquote>{selectedNote.text}</blockquote>
              <div className="survey__tag-row">
                {selectedNote.tags.map((tag) => (
                  <span key={tag} className="survey__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="survey__quote-empty">
              Select a cluster to inspect the underlying written feedback.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default function SurveyInsightsWidget() {
  const dailyUsers = RESPONDENTS.filter((item) => item.aiUsage === "Daily").length;
  const topConcern = CONCERN_COUNTS[0];
  const topValue = VALUE_COUNTS[0];
  const topOutcome = OUTCOME_COUNTS[0];

  return (
    <div className="survey">
      <p className="survey__intro">
        This dashboard turns the pre-workshop survey into a visual briefing: how
        ready the audience feels, what worries them, where they see value, and
        which concrete questions keep coming up in the written feedback.
      </p>

      <div className="survey__summary-grid">
        <SummaryCard
          eyebrow="Survey size"
          value={`${TOTAL_RESPONDENTS} respondents`}
          detail="A small but varied audience across engineering, leadership, QA, product, and agile coaching."
          accentClass="survey__summary-card--violet"
        />
        <SummaryCard
          eyebrow="Current usage"
          value={`${Math.round((dailyUsers / TOTAL_RESPONDENTS) * 100)}% use AI daily`}
          detail={`${dailyUsers} of ${TOTAL_RESPONDENTS} already use generative AI every day.`}
          accentClass="survey__summary-card--blue"
        />
        <SummaryCard
          eyebrow="Strongest concern"
          value={topConcern.label}
          detail={`${topConcern.value} mentions - much more about correctness than hype.`}
          accentClass="survey__summary-card--orange"
        />
        <SummaryCard
          eyebrow="Most requested workshop outcome"
          value={topOutcome.label}
          detail={`${topOutcome.value} mentions, closely followed by prompting, realistic practice, and output review.`}
          accentClass="survey__summary-card--green"
        />
      </div>

      <SentimentSunburst />

      <div className="survey__pack-grid">
        <PackChart
          title="What worries people"
          description="Circle packing surfaces the dominant concern pattern at a glance."
          items={CONCERN_COUNTS}
          hue="#ef4444"
        />
        <PackChart
          title="Where they see value"
          description="The positive side of the survey is concentrated around knowledge sharing, QA, and delivery speed."
          items={VALUE_COUNTS}
          hue="#10b981"
        />
      </div>

      <QuestionClusterExplorer />

      <div className="survey__footer-note">
        One more signal stands out: the biggest upside mentioned was{" "}
        <strong>{topValue.label.toLowerCase()}</strong> ({topValue.value} mentions),
        which suggests the workshop should mix hands-on coding with reusable team
        practices and review patterns.
      </div>
    </div>
  );
}
