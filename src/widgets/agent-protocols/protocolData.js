export const PROTOCOLS = [
  {
    id: "mcp",
    shortLabel: "MCP",
    name: "Model Context Protocol",
    accent: "#2563eb",
    oneLiner: "Standardize how an AI application or agent connects to tools, data, and workflows.",
    sourceLabel: "Model Context Protocol",
    sourceUrl:
      "https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro",
    bullets: [
      "Client/server protocol for exposing external capabilities to an agent.",
      "Best when the model needs a tool call, data source, or app integration.",
      "Makes one server usable across many compatible AI clients.",
    ],
  },
  {
    id: "skills",
    shortLabel: "Skills",
    name: "Agent Skills",
    accent: "#7c3aed",
    oneLiner: "Package reusable expertise so an agent can discover the right instructions, references, templates, and scripts.",
    sourceLabel: "Agent Skills",
    sourceUrl: "https://agentskills.io/home",
    bullets: [
      "A portable capability bundle rather than a network protocol.",
      "Best when the agent needs know-how, process guidance, or task-specific assets.",
      "Typically lives alongside files the agent can read and apply at the right moment.",
    ],
  },
  {
    id: "a2a",
    shortLabel: "A2A",
    name: "Agent2Agent Protocol",
    accent: "#ea580c",
    oneLiner: "Standardize how one agent discovers, delegates to, and collaborates with another agent.",
    sourceLabel: "Google Developers Blog",
    sourceUrl:
      "https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/",
    bullets: [
      "Agent-to-agent protocol focused on task exchange and collaboration.",
      "Best when a generalist agent should hand work to a specialist or remote agent.",
      "Supports discovery, long-running tasks, status updates, and multimodal artifacts.",
    ],
  },
];

export const COMPARISON_ROWS = [
  {
    dimension: "Primary job",
    mcp: "Connect an agent to tools, data, and external systems.",
    skills:
      "Give an agent packaged expertise and reusable operating instructions.",
    a2a: "Let one agent ask another agent to do work and return results.",
  },
  {
    dimension: "Main relationship",
    mcp: "Agent/client ↔ tool or data server",
    skills: "Agent ↔ local skill package",
    a2a: "Agent ↔ agent",
  },
  {
    dimension: "What gets standardized",
    mcp: "Tool and resource access",
    skills: "Capability packaging and discovery conventions",
    a2a: "Delegation, messaging, task lifecycle, and artifacts",
  },
  {
    dimension: "Best fit",
    mcp: "Read files, query systems, run utilities, trigger app actions",
    skills: "Apply a repeatable workflow or domain-specific playbook",
    a2a: "Coordinate specialists across teams, vendors, or runtimes",
  },
  {
    dimension: "Discovery mechanism",
    mcp: "Servers expose resources, prompts, and tools to compatible clients.",
    skills:
      "The agent discovers a skill folder and decides when to load its contents.",
    a2a: "Agents advertise capabilities via an Agent Card.",
  },
  {
    dimension: "Runtime shape",
    mcp: "Usually synchronous tool/resource access during a turn",
    skills: "Loaded into context when relevant; often no network hop required",
    a2a: "Task-oriented collaboration with updates for long-running work",
  },
  {
    dimension: "Mental model",
    mcp: "USB-C for AI tools",
    skills: "A reusable playbook in a folder",
    a2a: "A contract for specialist coworkers",
  },
];

export const LAYER_STEPS = [
  {
    id: "user",
    title: "User asks for a complex outcome",
    body: "For example: investigate customer churn, propose fixes, and open follow-up work.",
  },
  {
    id: "skills",
    title: "The agent loads a relevant skill",
    body: "A churn-analysis skill might provide instructions, SQL templates, and reporting structure.",
    accent: "#7c3aed",
  },
  {
    id: "mcp",
    title: "The agent uses MCP-connected systems",
    body: "It can query a warehouse, read docs, or call an issue tracker through standard tool interfaces.",
    accent: "#2563eb",
  },
  {
    id: "a2a",
    title: "The agent delegates to another agent over A2A",
    body: "A specialized research or data-cleaning agent can take ownership of a sub-task and return artifacts.",
    accent: "#ea580c",
  },
  {
    id: "result",
    title: "The user gets one coordinated result",
    body: "Skills shape behavior, MCP provides reach, and A2A expands the team.",
  },
];

export const SCENARIOS = [
  {
    need: "I want the agent to search Jira, query Postgres, or read cloud docs.",
    answer: "Use MCP.",
    why: "The problem is external tool and data connectivity.",
  },
  {
    need: "I want the agent to follow our incident-review workflow every time.",
    answer: "Use Agent Skills.",
    why: "The problem is reusable expertise, structure, and operating guidance.",
  },
  {
    need: "I want my main agent to hand a research task to a specialist agent.",
    answer: "Use A2A.",
    why: "The problem is collaboration between agents, not tool access.",
  },
  {
    need: "I want a specialist agent to use tools and follow a repeatable playbook.",
    answer: "Use all three together.",
    why: "Give the specialist a skill, connect its systems through MCP, and reach it through A2A.",
  },
];
