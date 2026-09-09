import level1Image from "../../assets/agent-maturity/level1.jpg";
import level2Image from "../../assets/agent-maturity/level2.jpg";
import level3Image from "../../assets/agent-maturity/level3.jpg";

export const MATURITY_LEVELS = [
  {
    id: "prompting",
    step: "1",
    label: "Prompting and waiting",
    accent: "#2563eb",
    image: level1Image,
    summary:
      "The developer prompts in VS Code and waits until the agent is done.",
    details:
      "This is still a tight human-in-the-loop workflow. The agent helps with implementation, but the developer is driving each step directly and checking progress turn by turn.",
    traits: [
      "One agent session at a time",
      "Human prompts, agent responds",
      "The developer still spends attention inside the code",
    ],
    shift: "AI accelerates coding, but the workflow is still fundamentally single-threaded.",
  },
  {
    id: "parallel",
    step: "2",
    label: "Multiple parallel sessions",
    accent: "#7c3aed",
    image: level2Image,
    summary:
      "The developer no longer looks at code directly and runs multiple worktrees in parallel, each on its own work item or ticket.",
    details:
      "The human role shifts from typing code to orchestrating work. Instead of one prompt stream, the developer supervises several active sessions at once and compares results at a higher level.",
    traits: [
      "Several active worktrees or sessions",
      "Each session owns a separate task",
      "The developer focuses on routing and review instead of line-by-line editing",
    ],
    shift: "AI stops being a single assistant and starts acting like a small parallel team.",
  },
  {
    id: "autonomous",
    step: "3",
    label: "Autonomous agents",
    accent: "#ea580c",
    image: level3Image,
    summary:
      "The developer writes specs, a coordinating agent turns them into work items, and other agents implement them.",
    details:
      "The interaction model becomes spec-driven rather than prompt-driven. The human defines intent and constraints, then an agent system decomposes, delegates, and executes the work with much less active prompting.",
    traits: [
      "Specs become the main input artifact",
      "A coordinating agent creates and routes work",
      "Implementation agents execute downstream tasks",
    ],
    shift: "AI becomes an operating model for delivery, not just a faster autocomplete loop.",
  },
];

export const MATURITY_DIMENSIONS = [
  {
    label: "Developer role",
    values: [
      "Prompting and checking",
      "Orchestrating several sessions",
      "Defining specs and guardrails",
    ],
  },
  {
    label: "Primary interface",
    values: [
      "Chat in the editor",
      "Session and worktree management",
      "Specs, work items, and automation",
    ],
  },
  {
    label: "What scales",
    values: [
      "One agent response",
      "Many concurrent tasks",
      "An end-to-end agent workflow",
    ],
  },
];
