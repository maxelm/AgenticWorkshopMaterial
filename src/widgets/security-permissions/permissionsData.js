export const TABS = [
  {
    id: "copilot-permissions",
    label: "Copilot Permissions",
    eyebrow: "Live now",
    description: "How tool visibility, approvals, and saved consent fit together.",
  },
  {
    id: "verification-loop",
    label: "Verification Loop",
    eyebrow: "Live now",
    description: "How CI gates catch bad changes before an agent can merge them.",
  },
  {
    id: "sandbox-strategies",
    label: "Sandbox Strategies",
    eyebrow: "Next",
    description: "Planned: when to reach for local sandboxes, cloud sandboxes, and YOLO modes.",
  },
];

export const HERO_METRICS = [
  {
    kicker: "Auto-allowed",
    value: "Read-only tools",
    detail: "Search, file reads, and read-only shell commands can run without a prompt.",
  },
  {
    kicker: "Human checkpoint",
    value: "Writes, risky shell, and URLs",
    detail: "Potentially destructive actions ask first unless you pre-approve them.",
  },
  {
    kicker: "Hard stop",
    value: "Deny beats allow",
    detail: "Deny rules override allow-all, one-off approvals, and saved approvals.",
  },
];

export const CONTROL_LAYERS = [
  {
    id: "visibility",
    step: "Layer 1",
    title: "Control what the model can even consider",
    flag: "--available-tools / --excluded-tools",
    accent: "#7c3aed",
    body:
      "Use visibility controls when you want to shape the model's menu up front. This stops wasted turns where Copilot tries a tool you never wanted it to use.",
    points: [
      "--available-tools keeps only the tools you list.",
      "--excluded-tools removes specific tools from the menu.",
      "If you provide both, the allowlist from --available-tools wins.",
    ],
  },
  {
    id: "permissions",
    step: "Layer 2",
    title: "Control which actions can run without asking",
    flag: "--allow-tool / --deny-tool",
    accent: "#2563eb",
    body:
      "Permission rules are the execution gate. They can allow broad tool kinds, exact commands, or narrow file-path patterns.",
    points: [
      "Allow rules skip the prompt for matching tools.",
      "Deny rules block matching tools completely.",
      "Patterns can target exact commands like shell(git commit).",
    ],
  },
  {
    id: "runtime",
    step: "Runtime",
    title: "Know what happens inside the session",
    flag: "Prompts, saved approvals, and reset",
    accent: "#f97316",
    body:
      "Without pre-approval, Copilot prompts when it reaches a sensitive action. You can allow once, allow for the session, or persist approval for the current location.",
    points: [
      "Prompt decisions can be one-time or session-wide.",
      "Current-location approvals live in permissions-config.json.",
      "/reset-allowed-tools rewinds session grants and local saved approvals.",
    ],
  },
];

export const PERSISTENCE_ZONES = [
  {
    id: "session",
    badge: "Ephemeral",
    title: "Session-only startup flags",
    subtitle: "Use for temporary guardrails",
    detail:
      "Command-line flags such as --allow-tool and --deny-tool apply only to the current session. They are not written to disk.",
    storage: "In-memory for this session",
    highlight: "Great for a one-off task or demo run.",
  },
  {
    id: "location",
    badge: "Scoped",
    title: "Repo or directory approvals",
    subtitle: "~/.copilot/permissions-config.json",
    detail:
      "Choosing 'don't ask again in this repo' or 'in this directory' stores approval for the current location. Outside a git repo, the working directory becomes the scope.",
    storage: "permissions-config.json",
    highlight: "Best when one project needs repeat access to the same safe actions.",
  },
  {
    id: "urls",
    badge: "Global",
    title: "Permanent URL approvals",
    subtitle: "~/.copilot/settings.json",
    detail:
      "Approved URLs are stored by domain in the allowedUrls list. Unlike file and shell approvals, this permission is shared across sessions.",
    storage: "settings.json -> allowedUrls",
    highlight: "Useful for trusted docs sites or internal portals you visit often.",
  },
  {
    id: "reset",
    badge: "Rewind",
    title: "Reset to your startup posture",
    subtitle: "/reset-allowed-tools",
    detail:
      "Reset revokes session-time grants, clears saved approvals for the current location, and returns you to the state defined by your startup flags or defaults.",
    storage: "Clears current-location approvals",
    highlight: "Ideal after experiments, risky commands, or a live workshop exercise.",
  },
];

export const COMMAND_RECIPES = [
  {
    id: "benchmarking",
    title: "Benchmarking without web access",
    summary:
      "Hide internet tools so Copilot stays local and does not spend turns trying web lookups.",
    command: "copilot --excluded-tools='web_fetch, web_search'",
    visible: ["Local code tools", "Shell access", "Read and write actions"],
    allowed: ["Default read-only work"],
    prompt: ["Writes, risky shell actions, and URL fetches still need approval"],
    blocked: ["web_fetch", "web_search"],
    callout:
      "This is the clearest example of using Layer 1: remove temptation before the model plans around it.",
  },
  {
    id: "git-without-push",
    title: "Allow git workflows, but never push",
    summary:
      "Pre-approve git commands broadly, then carve out one permanent no-go area.",
    command:
      "copilot --allow-tool='shell(git:*)' --deny-tool='shell(git push)'",
    visible: ["All normal tools remain visible"],
    allowed: ["git status", "git diff", "git add", "git commit"],
    prompt: ["Other sensitive shell and write actions still follow normal approval rules"],
    blocked: ["git push"],
    callout:
      "This shows the core precedence rule from the docs: deny always wins, even over a broader allow.",
  },
  {
    id: "file-scoped-write",
    title: "Only allow edits to one guidance file",
    summary:
      "Permit broad reading while narrowing writes to a single safe target file.",
    command:
      "copilot --allow-tool='read, write(.github/copilot-instructions.md)'",
    visible: ["All normal tools remain visible"],
    allowed: ["Read operations", "Writes to .github/copilot-instructions.md"],
    prompt: ["Writes anywhere else continue to ask"],
    blocked: [],
    callout:
      "Use this when you want Copilot to update a known control file without opening the rest of the repo to silent edits.",
  },
  {
    id: "restricted-session",
    title: "Edit and commit in a tight local sandbox",
    summary:
      "Restrict the visible tool menu, allow git shell commands, and explicitly deny push.",
    command:
      "copilot --available-tools='bash,edit,view,grep,glob' --allow-tool='shell(git:*)' --deny-tool='shell(git push)'",
    visible: ["bash", "edit", "view", "grep", "glob"],
    allowed: ["git commands except push", "Local editing and code exploration"],
    prompt: ["Sensitive actions inside the visible set still follow your permission rules"],
    blocked: ["web access", "sub-agents", "git push"],
    callout:
      "This is the strongest 'least privilege' recipe on the page: first shrink the surface, then approve exactly what stays useful.",
  },
];

export const EXAMPLE_ROWS = [
  {
    option: "--allow-tool=shell",
    effect: "Allow all shell commands without prompting.",
    why: "Useful only in a highly trusted or isolated environment.",
  },
  {
    option: "--allow-tool='shell(git commit)'",
    effect: "Allow exactly git commit.",
    why: "A good example of a narrow, confidence-building exception.",
  },
  {
    option: "--allow-tool='shell(git:*)' --deny-tool='shell(git push)'",
    effect: "Allow git commands broadly, but block pushes completely.",
    why: "Demonstrates deny-overrides-allow precedence.",
  },
  {
    option: "--deny-tool=write",
    effect: "Block all file writes.",
    why: "Best when you want analysis only and zero filesystem mutation.",
  },
  {
    option: "--allow-tool='read, write(.github/copilot-instructions.md)'",
    effect: "Allow all reads plus writes to a single file path.",
    why: "Shows that write access can be file-scoped rather than repo-wide.",
  },
  {
    option:
      "--available-tools='bash,edit,view,grep,glob' --allow-tool='shell(git:*)' --deny-tool='shell(git push)'",
    effect:
      "Create a constrained local-edit session that can commit but cannot reach the internet or push.",
    why: "A practical least-privilege starter profile for workshops.",
  },
];

export const SAFETY_NOTES = [
  {
    title: "Prefer guardrails over recovery",
    body:
      "If you already know web access, pushing, or broad writes are out of scope, hide or deny them before the session starts.",
  },
  {
    title: "Use broad allow-all options only in isolation",
    body:
      "The docs explicitly recommend reserving --allow-all, --allow-all-tools, and /yolo for isolated environments or sandboxes.",
  },
  {
    title: "Reset after risky detours",
    body:
      "After a session where you approved more than intended, /reset-allowed-tools gets you back to your startup posture.",
  },
];

export const VERIFICATION_LOOP_STAGES = [
  {
    id: "instructions",
    step: "1",
    title: "Agent instructions",
    accent: "#7c3aed",
    body:
      "Tell the agent exactly which checks matter and that it must run them locally before opening or updating a PR.",
  },
  {
    id: "local-run",
    step: "2",
    title: "Local verification",
    accent: "#2563eb",
    body:
      "The agent runs the relevant test, lint, and build commands in the working copy so obvious regressions are caught before code is pushed.",
  },
  {
    id: "ci-gates",
    step: "3",
    title: "CI verification gates",
    accent: "#10b981",
    body:
      "CI reruns the same baseline checks in a clean environment and adds higher-confidence gates such as full suites and browser automation.",
  },
  {
    id: "merge",
    step: "4",
    title: "Merge only if clean",
    accent: "#f97316",
    body:
      "Branch protection turns the verification loop into a merge barrier: failed checks stop bad code, even if the agent seemed confident.",
  },
];

export const VERIFICATION_METRICS = [
  {
    kicker: "Goal",
    value: "Fail fast, merge slow",
    detail: "Push confidence-building checks left, then let CI act as the final gate.",
  },
  {
    kicker: "Coverage pattern",
    value: "Positive + negative cases",
    detail: "Tests should prove expected behavior and reject invalid input, edge cases, and regressions.",
  },
  {
    kicker: "Agent habit",
    value: "Run locally before PR",
    detail: "Make this explicit in instructions so the agent validates before pushing changes upstream.",
  },
];

export const VERIFICATION_PILLARS = [
  {
    id: "unit-integration",
    icon: "🧪",
    title: "Unit and integration tests",
    accent: "#2563eb",
    summary:
      "Traditional tests still carry the core correctness burden. They should cover both the happy path and the failure path.",
    checks: [
      "Positive cases prove the feature works as intended.",
      "Negative cases prove bad input, invalid state, and permission errors are handled correctly.",
      "Integration tests catch contract drift between modules, services, databases, and APIs.",
    ],
    catches:
      "Wrong branching, broken contracts, missed null/validation handling, and changes that compile but violate business behavior.",
  },
  {
    id: "architecture",
    icon: "🏗️",
    title: "Architecture tests",
    accent: "#7c3aed",
    summary:
      "Architecture tests stop structural erosion: forbidden dependencies, broken layer boundaries, naming conventions, and misplaced code.",
    checks: [
      "Assert that domain code does not depend on infrastructure or UI layers.",
      "Enforce namespace, assembly, and suffix conventions.",
      "Catch shortcuts an agent might take when it edits the nearest file instead of the right layer.",
    ],
    catches:
      "Layer leaks, circular dependencies, controller-to-database shortcuts, and convention drift that slowly destabilizes the codebase.",
  },
  {
    id: "static-analysis",
    icon: "🔎",
    title: "Static analysis and lint",
    accent: "#10b981",
    summary:
      "Fast feedback for code smells, risky APIs, style drift, dead code, and analyzable correctness issues.",
    checks: [
      "Language analyzers and linters run on every PR.",
      "Warnings that matter to safety or maintainability should fail CI, not just decorate logs.",
      "Formatting and lint rules keep agent-generated changes consistent with repository conventions.",
    ],
    catches:
      "Unused code, suspicious async or nullability usage, risky patterns, inconsistent style, and issues humans may skip in review.",
  },
  {
    id: "playwright",
    icon: "🎭",
    title: "Playwright end-to-end coverage",
    accent: "#f97316",
    summary:
      "Browser automation validates the real user journey, not just the internal implementation.",
    checks: [
      "Smoke tests confirm the app boots and key workflows remain reachable.",
      "End-to-end flows verify the UI, network, auth, and backend behavior together.",
      "Negative browser tests ensure errors, permission blocks, and validation messages still appear correctly.",
    ],
    catches:
      "Broken routing, missing selectors, auth regressions, API/UI mismatches, and interaction bugs that unit tests never see.",
  },
];

export const DOTNET_ARCHITECTURE_OPTIONS = [
  {
    name: "ArchUnitNET",
    summary:
      "A strong .NET analogue for declarative architecture rules over assemblies, namespaces, layers, and dependencies.",
  },
  {
    name: "NetArchTest.Rules",
    summary:
      "A lightweight option for enforcing dependency and naming rules directly in test projects.",
  },
  {
    name: "NDepend",
    summary:
      "A richer commercial option when teams want deeper dependency analysis, architectural trends, and governance dashboards.",
  },
];

export const LOCAL_FIRST_GUIDANCE = [
  "State in the agent instructions that it must run the relevant tests locally before pushing or opening a PR.",
  "Prefer the smallest targeted commands first, then let CI run the full protected suite in a clean environment.",
  "Treat local success as the pre-flight check and CI as the merge gate, not as substitutes for one another.",
];

export const LEGACY_BOOTSTRAP = {
  title: "Starting from a legacy codebase with weak coverage",
  body:
    "Do not begin by letting the agent refactor the whole system freely. Start by adding tests around the current behavior, then use permissions to constrain write access to test folders until you have a reliable safety net.",
  tactics: [
    "Add characterization tests around the most brittle flows first.",
    "Cover both positive and negative cases before broadening refactors.",
    "Temporarily limit the agent to writing in test projects or test directories while it builds coverage.",
    "Expand write permissions only after the verification loop becomes trustworthy.",
  ],
};
