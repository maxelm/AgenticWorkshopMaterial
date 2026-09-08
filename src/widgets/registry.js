import TokenizerWidget from "./tokenizer/TokenizerWidget.jsx";
import LlmVisualizerWidget from "./llm-visualizer/LlmVisualizerWidget.jsx";
import AgentContextWidget from "./agent-context/AgentContextWidget.jsx";
import SkillsVisualizerWidget from "./skills-visualizer/SkillsVisualizerWidget.jsx";
import LlmAgentHarnessWidget from "./llm-agent-harness/LlmAgentHarnessWidget.jsx";
import SurveyInsightsWidget from "./survey-insights/SurveyInsightsWidget.jsx";
import SecurityPermissionsWidget from "./security-permissions/SecurityPermissionsWidget.jsx";

// Central registry of all widgets shown on the dashboard.
// Add a new entry here whenever a new widget is implemented.
const widgets = [
  {
    id: "tokenizer",
    path: "/tokenizer",
    title: "Tokenizer Visualizer",
    description:
      "Encode text into LLM tokens (and back again) and see how different open-source tokenizers split up your text.",
    icon: "🔤",
    component: TokenizerWidget,
  },
  {
    id: "llm-visualizer",
    path: "/llm-visualizer",
    title: "LLM Context Visualizer",
    description:
      "Chat with a hosted open-source LLM and watch the exact context (system prompt, tools, history) sent to the model each turn.",
    icon: "🧠",
    component: LlmVisualizerWidget,
  },
  {
    id: "agent-context",
    path: "/agent-context",
    title: "Agent Context Visualizer",
    description:
      "See how a coding agent builds up its context window step by step from AGENTS.md, Agent Skills, MCP servers, and your prompt.",
    icon: "🗂️",
    component: AgentContextWidget,
  },
  {
    id: "skills-visualizer",
    path: "/skills-visualizer",
    title: "Skills Visualizer",
    description:
      "Explore a real, moderately complex Agent Skill folder - SKILL.md, references, templates and scripts - with an annotated frontmatter and per-file explanations.",
    icon: "🧰",
    component: SkillsVisualizerWidget,
  },
  {
    id: "llm-agent-harness",
    path: "/llm-agent-harness",
    title: "LLM, Agent, and Harness",
    description:
      "A D3 relationship map showing how the harness holds context, drives the LLM, owns tools, and creates agent behavior through a repeated loop.",
    icon: "🪄",
    component: LlmAgentHarnessWidget,
  },
  {
    id: "survey-insights",
    path: "/survey-insights",
    title: "Workshop Survey Explorer",
    description:
      "Interactive D3 views of the pre-workshop survey: audience sentiment, top concerns, perceived value, and clustered written feedback.",
    icon: "🌞",
    component: SurveyInsightsWidget,
  },
  {
    id: "security-permissions",
    path: "/security-permissions",
    title: "Security & Permissions",
    description:
      "A multi-view security dashboard that turns Copilot CLI permission guidance into visual rules, storage scopes, and command recipes.",
    icon: "🛡️",
    component: SecurityPermissionsWidget,
  },
];

export default widgets;
