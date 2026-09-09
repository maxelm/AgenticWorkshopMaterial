// The workshop agenda, in running order. Each entry is one session/segment.
// `path` links to the matching interactive widget when one exists so
// attendees can jump straight to that topic's deep dive.

export const AGENDA = [
  {
    id: "welcome",
    title: "Welcome & Introduction",
  },
  {
    id: "ai-foundations",
    title: "AI Foundations: Understanding the Terminology",
  },
  {
    id: "how-agents-work",
    title: "How Coding Agents Actually Work",
    path: "/llm-agent-harness",
  },
  {
    id: "three-levels",
    title: "The Three Levels of Agentic Coding",
    path: "/agent-maturity",
  },
  {
    id: "non-coding-exercise",
    title: "Non-Coding Exercise with GitHub Copilot",
  },
  {
    id: "prompting-best-practices",
    title: "Prompting Best Practices",
    path: "/prompting-techniques",
  },
  {
    id: "working-with-agents",
    title: "Working with Coding Agents",
    path: "/agent-context",
  },
  {
    id: "architecture-design",
    title: "Defining Architecture and System Design",
    path: "/spec-driven-development",
  },
  {
    id: "security-governance",
    title: "Security & Governance for Coding Agents",
    path: "/security-permissions",
  },
  {
    id: "testing-review",
    title: "Testing and Code Review",
  },
  {
    id: "work-items",
    title: "Working with Work Items",
  },
  {
    id: "common-failures",
    title: "Common Failures",
    path: "/common-failures",
  },
  {
    id: "whats-next",
    title: "What is Next?",
  },
];
