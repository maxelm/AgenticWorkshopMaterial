export const RESPONDENTS = [
  {
    id: 2,
    role: "Software developer / engineer",
    aiUsage: "Daily",
    confidence: 2,
    autonomy: "The agent proposes edits; a person approves each edit",
    track: "Hands-on technical track",
  },
  {
    id: 3,
    role: "Software developer / engineer",
    aiUsage: "Several times a week",
    confidence: 4,
    autonomy: "The agent proposes edits; a person approves each edit",
    track: "Hands-on technical track",
  },
  {
    id: 4,
    role: "Technical lead / architect",
    aiUsage: "Daily",
    confidence: 4,
    autonomy: "The agent proposes edits; a person approves each edit",
    track: "Hands-on technical track",
  },
  {
    id: 5,
    role: "Product owner / product manager",
    aiUsage: "Daily",
    confidence: 1,
    autonomy: "I don't know",
    track: "Product, leadership, and operating-model track",
  },
  {
    id: 6,
    role: "Software developer / engineer",
    aiUsage: "Daily",
    confidence: 3,
    autonomy: "The agent edits files; a person reviews the full diff before committing",
    track: "Hands-on technical track",
  },
  {
    id: 7,
    role: "Technical lead / architect",
    aiUsage: "Rarely",
    confidence: 3,
    autonomy: "Suggestions only; a person accepts changes line by line",
    track: "Product, leadership, and operating-model track",
  },
  {
    id: 8,
    role: "Quality assurance / tester",
    aiUsage: "Daily",
    confidence: 1,
    autonomy: "The agent proposes edits; a person approves each edit",
    track: "Not sure",
  },
  {
    id: 9,
    role: "Quality assurance / tester",
    aiUsage: "Never",
    confidence: 2,
    autonomy: "I don't know",
    track: "A blended track for mixed roles",
  },
  {
    id: 10,
    role: "Quality assurance / tester",
    aiUsage: "Rarely",
    confidence: 3,
    autonomy: "I don't know",
    track: "Product, leadership, and operating-model track",
  },
  {
    id: 11,
    role: "Quality assurance / tester",
    aiUsage: "Rarely",
    confidence: 2,
    autonomy: "I don't know",
    track: "Not sure",
  },
  {
    id: 12,
    role: "Software developer / engineer",
    aiUsage: "Daily",
    confidence: 4,
    autonomy: "The agent runs commands and tests; a person reviews the result",
    track: "A blended track for mixed roles",
  },
  {
    id: 13,
    role: "Software developer / engineer",
    aiUsage: "Daily",
    confidence: 4,
    autonomy: "The agent runs commands and tests; a person reviews the result",
    track: "Not sure",
  },
  {
    id: 14,
    role: "Technical lead / architect",
    aiUsage: "Several times a week",
    confidence: 4,
    autonomy: "I don't know",
    track: "Product, leadership, and operating-model track",
  },
  {
    id: 15,
    role: "Software developer / engineer",
    aiUsage: "Daily",
    confidence: 4,
    autonomy: "The agent runs commands and tests; a person reviews the result",
    track: "A blended track for mixed roles",
  },
  {
    id: 16,
    role: "Technical lead / architect",
    aiUsage: "Daily",
    confidence: 3,
    autonomy: "The agent proposes edits; a person approves each edit",
    track: "Hands-on technical track",
  },
  {
    id: 17,
    role: "Scrum master / agile coach",
    aiUsage: "Daily",
    confidence: 2,
    autonomy: "I don't know",
    track: "Product, leadership, and operating-model track",
  },
  {
    id: 18,
    role: "Software developer / engineer",
    aiUsage: "Daily",
    confidence: 3,
    autonomy: "The agent edits files; a person reviews the full diff before committing",
    track: "A blended track for mixed roles",
  },
];

export const CONCERN_COUNTS = [
  { label: "Incorrect or low-quality output", value: 13 },
  { label: "Loss of skills or over-reliance", value: 10 },
  { label: "Security, privacy, or compliance", value: 8 },
  { label: "Uneven adoption across the team", value: 4 },
  { label: "My role may be seen as less necessary", value: 3 },
  { label: "Role boundaries may become less clear", value: 3 },
  { label: "Unclear accountability", value: 3 },
  { label: "Harder review, planning, or estimation", value: 3 },
  { label: "No major concerns", value: 2 },
  { label: "I don't know", value: 1 },
];

export const VALUE_COUNTS = [
  { label: "Documentation and knowledge sharing", value: 12 },
  { label: "Testing and quality assurance", value: 11 },
  { label: "Implementation speed", value: 9 },
  { label: "Reporting, summaries, or status communication", value: 7 },
  { label: "Incident investigation and support", value: 6 },
  { label: "Planning and estimation", value: 5 },
  { label: "Backlog refinement or specification quality", value: 4 },
  { label: "I don't know", value: 2 },
];

export const OUTCOME_COUNTS = [
  { label: "Understand security and compliance guardrails", value: 13 },
  { label: "Learn effective prompting and task decomposition", value: 10 },
  { label: "Practice using an agent on a realistic task", value: 9 },
  { label: "Review and validate agent output", value: 9 },
  { label: "Discuss role and operating-model changes", value: 7 },
  { label: "Plan adoption in a team or product context", value: 7 },
  { label: "Understand agentic coding concepts", value: 3 },
];

export const QUESTION_THEMES = [
  {
    id: "guardrails",
    title: "Guardrails & governance",
    description:
      "The biggest theme is not 'can the model code?' - it's 'what rules, approvals, and accountability wrap around it?'",
    color: "#7c3aed",
  },
  {
    id: "quality",
    title: "Quality & trust",
    description:
      "People want better ways to validate output: review criteria, independent checks, tests, data provenance, and expert feedback loops.",
    color: "#2563eb",
  },
  {
    id: "workflow",
    title: "Workflow automation",
    description:
      "Several respondents are interested in using agents to reduce coordination work around backlog refinement, planning, notes, and team routines.",
    color: "#0f766e",
  },
  {
    id: "tooling",
    title: "Tooling & enablement",
    description:
      "Developers want access to stronger models, reusable instructions, shared tooling, and space to build their own automation.",
    color: "#ea580c",
  },
  {
    id: "use-cases",
    title: "Role-specific use cases",
    description:
      "The workshop audience wants concrete, role-shaped examples - not only code generation, but QA, infrastructure, product, and adoption scenarios.",
    color: "#db2777",
  },
];

export const OPEN_FEEDBACK = [
  {
    id: "po-azure-backlog",
    role: "Product owner / product manager",
    kind: "Workshop task",
    themeId: "workflow",
    title: "Create backlog items directly from Copilot output",
    text:
      "When I create user stories in Copilot, and I have verify that they are correct, would be nice that I agent would automatically create this user story in my backlog, so I don't need to spend time adminstering - manually inputing the user story and copy pasting the generated validated text into Azure.",
    tags: ["Azure DevOps", "backlog", "automation"],
  },
  {
    id: "po-backlog-hygiene",
    role: "Product owner / product manager",
    kind: "Workflow idea",
    themeId: "workflow",
    title: "Find duplicates and stale backlog items",
    text:
      "I also think that I could be able to search the backlog verifying that such item already exists and I am not creating a duplicate. I'd think that there could be automatic agent that checks if some items lay in the backlog for more than a year, we should review them - maybe even discard them.",
    tags: ["backlog hygiene", "deduplication", "automation"],
  },
  {
    id: "po-system-fit",
    role: "Product owner / product manager",
    kind: "Question",
    themeId: "use-cases",
    title: "Can an agent reason about architecture fit?",
    text:
      "If we take an unstructured business description and input it in Copilot, could it suggest possible solutions and flag incompatible integrations or potential problem areas based on our cloud infrastructure, security, and logical modules?",
    tags: ["architecture", "requirements", "security"],
  },
  {
    id: "qa-validation",
    role: "Quality assurance / tester",
    kind: "Validation need",
    themeId: "quality",
    title: "Show the process and data sources",
    text:
      "Follow the process of created result, assert data sources, consulting with the area expert person.",
    tags: ["traceability", "data sources", "expert review"],
  },
  {
    id: "qa-learning-guardrails",
    role: "Quality assurance / tester",
    kind: "Adoption need",
    themeId: "guardrails",
    title: "Time to learn and clear rules",
    text:
      "Dedicated time to learn new tools, strict guidelines, person reviews AI generated code. Follow-up on employee mental load due to increased work pace.",
    tags: ["training", "human review", "guidelines"],
  },
  {
    id: "qa-opt-in",
    role: "Quality assurance / tester",
    kind: "Question",
    themeId: "guardrails",
    title: "What permissions do we need by role?",
    text:
      "If I have a choice of what I want to use - not pushed on me. What can we actually do with AI, and what permissions do we need to use it (by role)?",
    tags: ["permissions", "opt-in", "role boundaries"],
  },
  {
    id: "qa-manual-testing",
    role: "Quality assurance / tester",
    kind: "Workshop task",
    themeId: "use-cases",
    title: "Manual QA and complex system examples",
    text:
      "I'm more interested in how they see AI being used by Manual QA for complex systems. Configuring of Virtual Machines (Windows Server). Desktop app UI test automation.",
    tags: ["manual QA", "infrastructure", "test automation"],
  },
  {
    id: "eng-latest-tools",
    role: "Software developer / engineer",
    kind: "Enablement ask",
    themeId: "tooling",
    title: "Give us current models and tools",
    text:
      "Access to the latest LLM:s and AI tools. Let's not be cheap in these areas. We need access to the latest AI tools and the smartest LLMs.",
    tags: ["model access", "enablement", "platform"],
  },
  {
    id: "eng-policies",
    role: "Software developer / engineer",
    kind: "Governance ask",
    themeId: "guardrails",
    title: "Shared policies and independent review",
    text:
      "Common policies and instructions applied to agents, both on company, department and team levels. Automatic code reviews by a different agent than wrote the code. Gather input, create and agree upon AI policies and instructions, then apply them.",
    tags: ["shared instructions", "policy", "review"],
  },
  {
    id: "eng-guardrails-focus",
    role: "Software developer / engineer",
    kind: "Workshop preference",
    themeId: "guardrails",
    title: "Focus on guardrails more than basics",
    text:
      "I'd like to focus on tooling/agent guardrails and instructions, since I believe that largely will impact quality, security and consistency between developers.",
    tags: ["guardrails", "quality", "security"],
  },
  {
    id: "eng-accountability",
    role: "Software developer / engineer",
    kind: "Operating model",
    themeId: "guardrails",
    title: "Clear workflow and approval boundaries",
    text:
      "Clear and established workflow(s) and accountability for output within the team, make use of proper agent configuration / control mechanisms to not run any command / install packages without human approval the first time.",
    tags: ["accountability", "approvals", "workflow"],
  },
  {
    id: "eng-build-tools",
    role: "Software developer / engineer",
    kind: "Workshop task",
    themeId: "tooling",
    title: "Build custom tooling and shared conventions",
    text:
      "Aligning within the team to implement common AI processes into an existing codebase - what belongs in shared instructions, shared tooling, and established patterns to use. Using AI to create custom tooling from scratch such as custom scripts, middlewares, and MCPs.",
    tags: ["MCP", "custom tooling", "team conventions"],
  },
  {
    id: "scrum-quality-criteria",
    role: "Scrum master / agile coach",
    kind: "Validation need",
    themeId: "quality",
    title: "Use measurable quality criteria and feedback loops",
    text:
      "I would rely on well-defined quality criteria, expert review, and measurable outcomes. Clear acceptance criteria, transparency, and feedback loops would help me evaluate whether AI-generated work is accurate, valuable, and fit for purpose.",
    tags: ["acceptance criteria", "feedback loops", "transparency"],
  },
  {
    id: "scrum-governance",
    role: "Scrum master / agile coach",
    kind: "Adoption scenario",
    themeId: "workflow",
    title: "Explore team-wide AI adoption with governance",
    text:
      "I'd like to explore a real-world AI adoption scenario, including how AI can support backlog refinement and planning, and how we can establish common principles, governance, and quality controls to ensure consistent adoption across teams and products.",
    tags: ["adoption", "planning", "governance"],
  },
  {
    id: "eng-human-readable",
    role: "Software developer / engineer",
    kind: "Quality signal",
    themeId: "quality",
    title: "Make output compact and reviewable",
    text:
      "Compact proposals and consistent answers consumable by human. Difficult to tell how to assess quality otherwise.",
    tags: ["reviewability", "signal-to-noise", "quality"],
  },
];
