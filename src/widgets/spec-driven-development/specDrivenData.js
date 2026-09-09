export const HERO_POINTS = [
  {
    label: "Core shift",
    value: "Specs become the durable source of truth, not disposable scaffolding.",
  },
  {
    label: "What AI gets",
    value: "Requirements, constraints, edge cases, and acceptance criteria in one shared artifact.",
  },
  {
    label: "Why it helps",
    value: "Less translation loss, less rework, and more predictable delivery as complexity grows.",
  },
];

export const PRINCIPLES = [
  {
    title: "Align first, prompt second",
    body: "Instead of relying on scattered prompts, the team agrees on intent before implementation starts.",
  },
  {
    title: "Keep intent durable",
    body: "The spec links business goals, architecture, implementation, tests, and validation across the lifecycle.",
  },
  {
    title: "Make ambiguity explicit",
    body: "Unknowns, constraints, dependencies, and edge cases are clarified up front instead of surfacing as churn later.",
  },
  {
    title: "Validate against the spec",
    body: "The final question is not just 'does it run?' but 'does it satisfy the agreed intent?'",
  },
];

export const LIFECYCLE_STEPS = [
  {
    step: "1",
    title: "Constitution",
    body: "Define principles, standards, and guardrails for how the project should be built.",
    accent: "#2563eb",
  },
  {
    step: "2",
    title: "Specify",
    body: "Capture scenarios, requirements, and acceptance criteria in language the team can review together.",
    accent: "#7c3aed",
  },
  {
    step: "3",
    title: "Clarify",
    body: "Resolve ambiguity, hidden assumptions, dependencies, and edge cases before code generation runs ahead.",
    accent: "#0f766e",
  },
  {
    step: "4",
    title: "Plan",
    body: "Translate intent into architecture, constraints, flows, and implementation boundaries.",
    accent: "#ea580c",
  },
  {
    step: "5",
    title: "Tasks",
    body: "Break the plan into implementation-ready units so humans and agents can execute against the same map.",
    accent: "#db2777",
  },
  {
    step: "6",
    title: "Implement",
    body: "Use AI to generate and refine code, tests, and support artifacts while staying grounded in the spec.",
    accent: "#0891b2",
  },
  {
    step: "7",
    title: "Validate",
    body: "Check whether the output converges with the spec instead of treating compilation success as the finish line.",
    accent: "#16a34a",
  },
];

export const BENEFITS = [
  "Less ambiguity and rework because requirements are clarified earlier.",
  "Better alignment across product, engineering, and test through one shared source of truth.",
  "Faster implementation because AI can generate from structured context instead of fragmented prompts.",
  "More predictable delivery because acceptance criteria stay attached to the original intent.",
];

export const SPECKIT_HIGHLIGHTS = [
  {
    title: "Open-source toolkit",
    body: "GitHub Spec Kit packages a ready-to-use spec-driven workflow instead of leaving every team to invent its own process from scratch.",
  },
  {
    title: "Executable workflow",
    body: "It turns the lifecycle into concrete agent commands for principles, specification, planning, task breakdown, implementation, and convergence.",
  },
  {
    title: "Extensible ecosystem",
    body: "Beyond the core flow, Spec Kit supports extensions, presets, bundles, walkthroughs, and community-contributed resources.",
  },
  {
    title: "Broad agent support",
    body: "The project documents integrations for 30+ AI coding agents, including GitHub Copilot-oriented setup paths.",
  },
];

export const COMMAND_FLOW = [
  {
    command: "/speckit.constitution",
    title: "Establish project principles",
    body: "Define code quality, testing, UX, performance, and team guardrails once so later work inherits them.",
  },
  {
    command: "/speckit.specify",
    title: "Describe the outcome",
    body: "Focus on what should be built and why, including user scenarios and acceptance criteria.",
  },
  {
    command: "/speckit.plan",
    title: "Lock in implementation constraints",
    body: "Translate the spec into tech stack, architecture, boundaries, and major trade-offs.",
  },
  {
    command: "/speckit.tasks",
    title: "Create actionable work units",
    body: "Break the plan into a task list that can be executed incrementally and reviewed clearly.",
  },
  {
    command: "/speckit.implement",
    title: "Execute against the plan",
    body: "Generate and refine the implementation while keeping the plan and spec in scope.",
  },
  {
    command: "/speckit.converge",
    title: "Check alignment at the end",
    body: "Verify the implementation still matches the spec, plan, and tasks; repeat until converged.",
  },
];

export const EXTENSIONS = [
  {
    name: "Bug extension",
    flow: "Assess -> Fix -> Test",
    body: "Adds an evidence-based bug-fixing workflow so agents validate diagnosis before jumping to a patch.",
  },
  {
    name: "Assess extension",
    flow: "Intake -> Research -> Define -> Shape -> Decide",
    body: "Turns raw ideas into a documented go, needs-clarification, or kill decision before implementation starts.",
  },
];

export const GETTING_STARTED = [
  {
    title: "Pick a feature with visible alignment risk",
    body: "Start where requirements tend to drift, not with the smallest toy problem.",
  },
  {
    title: "Write a lightweight but explicit spec",
    body: "Capture scenarios, constraints, and acceptance criteria without over-specifying every implementation detail.",
  },
  {
    title: "Generate from the spec, not from memory",
    body: "Use the spec as the shared context for code, tests, and review conversations.",
  },
  {
    title: "Treat the spec as a living artifact",
    body: "Refine the process where it reduces churn and keep it right-sized for the change at hand.",
  },
];

export const RESOURCE_LINKS = [
  {
    title: "Microsoft overview: Spec-Driven Development",
    url: "https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering/",
    description:
      "The post that frames SDD as a spec-first workflow for reducing translation loss across requirements, design, implementation, and validation.",
  },
  {
    title: "GitHub Spec Kit repository",
    url: "https://github.com/github/spec-kit",
    description:
      "The open-source toolkit that operationalizes SDD with a ready-to-use workflow, docs, releases, and community extensions.",
  },
  {
    title: "Spec Kit documentation",
    url: "https://github.github.io/spec-kit/",
    description:
      "Reference docs for installation, extensions, presets, bundles, walkthroughs, and supported integrations.",
  },
  {
    title: "Spec Kit releases",
    url: "https://github.com/github/spec-kit/releases",
    description:
      "Release history for the CLI and templates when you want to pin or upgrade a specific version.",
  },
];

export const INSTALL_COMMANDS = [
  "uv tool install specify-cli",
  "specify init my-project --integration copilot",
  "cd my-project",
];
