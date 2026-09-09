import TokenizerWidget from "./tokenizer/TokenizerWidget.jsx";
import LlmVisualizerWidget from "./llm-visualizer/LlmVisualizerWidget.jsx";
import AgentContextWidget from "./agent-context/AgentContextWidget.jsx";
import SkillsVisualizerWidget from "./skills-visualizer/SkillsVisualizerWidget.jsx";
import LlmAgentHarnessWidget from "./llm-agent-harness/LlmAgentHarnessWidget.jsx";
import SurveyInsightsWidget from "./survey-insights/SurveyInsightsWidget.jsx";
import SecurityPermissionsWidget from "./security-permissions/SecurityPermissionsWidget.jsx";
import AgentProtocolsWidget from "./agent-protocols/AgentProtocolsWidget.jsx";
import SpecDrivenDevelopmentWidget from "./spec-driven-development/SpecDrivenDevelopmentWidget.jsx";
import AgentMaturityWidget from "./agent-maturity/AgentMaturityWidget.jsx";
import PromptingTechniquesWidget from "./prompting-techniques/PromptingTechniquesWidget.jsx";
import AgentsMdWidget from "./agents-md/AgentsMdWidget.jsx";
import CommonFailuresWidget from "./common-failures/CommonFailuresWidget.jsx";
import AgendaWidget from "./agenda/AgendaWidget.jsx";

// Central registry of all widgets shown on the dashboard.
// Add a new entry here whenever a new widget is implemented.
const widgets = [
  {
    id: "agenda",
    path: "/agenda",
    title: "Agenda",
    description:
      "The workshop's running order, from welcome and AI foundations through prompting, architecture, security, testing, and what's next - with links to each topic's deep-dive widget.",
    icon: "🗓️",
    component: AgendaWidget,
  },
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
    title: "Security & Governance",
    description:
      "A multi-view security dashboard that turns Copilot CLI permission guidance into visual rules, storage scopes, and command recipes.",
    icon: "🛡️",
    component: SecurityPermissionsWidget,
  },
  {
    id: "agent-protocols",
    path: "/agent-protocols",
    title: "MCP vs Skills vs A2A",
    description:
      "A compact guide to the differences between Model Context Protocol, Agent Skills, and Agent2Agent - what each standardizes, when to use it, and how they fit together.",
    icon: "🔗",
    component: AgentProtocolsWidget,
  },
  {
    id: "spec-driven-development",
    path: "/spec-driven-development",
    title: "Spec-Driven Development",
    description:
      "A spec-first guide to aligning intent, planning with constraints, and using GitHub Spec Kit to turn requirements into implementation and validation.",
    icon: "🧭",
    component: SpecDrivenDevelopmentWidget,
  },
  {
    id: "agent-maturity",
    path: "/agent-maturity",
    title: "Three Levels of Agentic Coding",
    description:
      "A three-step visual that shows how work moves from prompt-and-wait usage, to parallel worktrees, to spec-driven autonomous agent systems.",
    icon: "🪜",
    component: AgentMaturityWidget,
  },
  {
    id: "prompting-techniques",
    path: "/prompting-techniques",
    title: "Prompting Techniques",
    description:
      "A pane per General Principle from Anthropic's Claude prompting best practices guide - clarity, context, examples, XML structure, roles, long context, and model self-knowledge.",
    icon: "✍️",
    component: PromptingTechniquesWidget,
  },
  {
    id: "agents-md",
    path: "/agents-md",
    title: "AGENTS.md",
    description:
      "Best practices for writing an AGENTS.md file from HumanLayer's guide - onboarding an agent with WHAT/WHY/HOW, why less is more, progressive disclosure, and why the agent shouldn't be your linter.",
    icon: "📝",
    component: AgentsMdWidget,
  },
  {
    id: "common-failures",
    path: "/common-failures",
    title: "Common Failures",
    description:
      "A pane per recurring failure mode teams hit when adopting agentic coding - context rot and scope creep, review bottlenecks, missing safety nets, nitpicking, and skipping the plan.",
    icon: "⚠️",
    component: CommonFailuresWidget,
  },
];

export default widgets;
