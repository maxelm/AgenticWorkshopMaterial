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
    id: "code-review-agent",
    label: "Code Review Agent",
    eyebrow: "Live now",
    description: "How Copilot code review improves pull request quality inside your CI/CD flow.",
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

export const OFFICIAL_RESOURCES = [
  {
    title: "Allowing and denying tool use",
    url: "https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools#introduction",
    description:
      "The canonical explanation of the two-layer permission model, persisted approvals, permissive flags, and reset behavior.",
  },
  {
    title: "CLI command reference",
    url: "https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#tool-permission-patterns",
    description:
      "Use this when you need the exact syntax for tool kinds, path patterns, and command matching.",
  },
  {
    title: "Configuration directory reference",
    url: "https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference#permissions-configjson",
    description:
      "Shows where saved approvals live and how permissions-config.json and settings.json are structured.",
  },
];

export const SESSION_COMMANDS = [
  {
    command: "/allow-all or /yolo",
    effect:
      "Allows all available tools for the rest of the current interactive session. Treat this as a sandbox-only shortcut.",
  },
  {
    command: "/reset-allowed-tools",
    effect:
      "Revokes session-time grants, clears saved approvals for the current location, and returns you to your startup posture.",
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
    prompt: ["Writes and risky shell actions still need approval"],
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
    id: "coverage",
    step: "Test category 1",
    title: "Full test coverage",
    accent: "#2563eb",
    body:
      "Run unit and integration tests on every PR, and publish code coverage so the agent can immediately see which changed behavior is still missing tests.",
  },
  {
    id: "parameterized",
    step: "Test category 2",
    title: "Parameterized tests",
    accent: "#7c3aed",
    body:
      "Run parameterized tests on every PR for validation matrices, permission rules, edge cases, and input combinations so one test shape can cover many outcomes cleanly.",
  },
  {
    id: "ui",
    step: "Test category 3",
    title: "End-to-end UI coverage",
    accent: "#10b981",
    body:
      "Run full UI and end-to-end tests on every PR, using Playwright for web and FlaUI for desktop so complicated apps prove the real user experience still works.",
  },
  {
    id: "architecture",
    step: "Test category 4",
    title: "Architecture rules",
    accent: "#f97316",
    body:
      "Validate structural rules on every PR with architecture tests so new code cannot quietly break layering, dependency direction, or placement rules.",
  },
];

export const VERIFICATION_METRICS = [
  {
    kicker: "PR rule",
    value: "Run all tests on every PR",
    detail: "Unit, integration, full UI, end-to-end, and architecture tests all belong in protected PR validation, not as optional follow-up work.",
  },
  {
    kicker: "Coverage signal",
    value: "Show what is missing",
    detail: "Coverage tooling gives the agent and reviewers a fast way to spot paths that changed without gaining tests.",
  },
  {
    kicker: "Structural safety",
    value: "Guard behavior and design",
    detail: "A trustworthy loop checks both application behavior and whether new code still respects the intended architectural boundaries.",
  },
];

export const CODE_REVIEW_METRICS = [
  {
    kicker: "Turnaround",
    value: "Usually under 30 seconds",
    detail: "Copilot code review is fast enough to act like an early PR signal instead of a late audit.",
  },
  {
    kicker: "Prioritization",
    value: "High, Medium, Low",
    detail: "Each comment includes severity so reviewers can triage findings instead of treating every note the same.",
  },
  {
    kicker: "Delivery model",
    value: "Manual or automatic",
    detail: "You can request a review per PR, or configure automatic reviews and re-reviews on new pushes.",
  },
];

export const CODE_REVIEW_FLOW = [
  {
    id: "request",
    step: "1",
    title: "Trigger review from the PR",
    accent: "#7c3aed",
    body:
      "Ask Copilot for a review the same way you request a human reviewer, or enable automatic review so every pull request enters the pipeline with AI review coverage.",
  },
  {
    id: "analyze",
    step: "2",
    title: "Let the agent inspect the diff",
    accent: "#2563eb",
    body:
      "Copilot code review runs agentic capabilities through GitHub Actions, which makes it suitable for CI/CD workflows where review logic should execute in a repeatable environment.",
  },
  {
    id: "prioritize",
    step: "3",
    title: "Triage severity-tagged findings",
    accent: "#10b981",
    body:
      "Comments are labeled High, Medium, or Low, helping teams focus first on bugs, risky logic, and security-sensitive issues that matter more than style noise.",
  },
  {
    id: "iterate",
    step: "4",
    title: "Apply fixes and re-review",
    accent: "#f97316",
    body:
      "Suggested changes can be accepted directly, Fix with Copilot can implement follow-up work, and re-review can be requested after new commits land.",
  },
];

export const CODE_REVIEW_PILLARS = [
  {
    id: "llm-safety-net",
    icon: "🧭",
    title: "A second reader for fast-moving changes",
    accent: "#2563eb",
    summary:
      "LLM-generated code can look plausible while still hiding edge-case bugs, missing validation, or risky assumptions. A review agent adds another pass before merge.",
    checks: [
      "Flags defects in complex logic before a human reviewer has to discover them manually.",
      "Surfaces security-sensitive or suspicious implementation details earlier in the PR lifecycle.",
      "Helps keep generated code from bypassing repository conventions simply because it compiles.",
    ],
    catches:
      "Confident-but-wrong code, subtle regressions in the diff, and issues humans might miss on the first skim.",
  },
  {
    id: "pr-comments",
    icon: "💬",
    title: "Review comments that fit normal PR workflow",
    accent: "#7c3aed",
    summary:
      "Copilot's feedback lands as pull request review comments, with suggested changes where possible, so teams can handle it inside the same code review loop they already use.",
    checks: [
      "Review comments can be resolved, reacted to, hidden, and discussed like human comments.",
      "Suggested edits can often be applied with a couple of clicks.",
      "By default Copilot leaves a Comment review rather than blocking approvals, unless approvals are explicitly configured.",
    ],
    catches:
      "Process friction: the AI review stays inside the PR instead of becoming separate tooling that developers ignore.",
  },
  {
    id: "customized-reviews",
    icon: "🧠",
    title: "Teach the reviewer what good looks like",
    accent: "#10b981",
    summary:
      "Custom instructions, AGENTS.md, path-specific instructions, agent skills, and MCP servers all make reviews more relevant to your architecture and standards.",
    checks: [
      "Use .github/copilot-instructions.md for repo-wide review expectations.",
      "Use AGENTS.md to explain intentional patterns, architecture, and areas that need deeper scrutiny.",
      "Use .github/instructions/**/*.instructions.md for subsystem- or path-specific review guidance.",
    ],
    catches:
      "Generic feedback that misses business rules, intentional patterns, or specialized subsystem constraints.",
  },
  {
    id: "automation-fit",
    icon: "⚙️",
    title: "Built for CI/CD-style automation",
    accent: "#f97316",
    summary:
      "Automatic reviews, re-reviews on new pushes, configurable review effort, and a dedicated ephemeral environment make Copilot review fit naturally into an automated delivery pipeline.",
    checks: [
      "Choose Lite for cost-efficient checks or Balanced for deeper reasoning on critical changes.",
      "Enable automatic reviews to cover every PR and optionally every new push.",
      "Customize the environment with .github/workflows/copilot-code-review.yml when review setup should differ from cloud agent setup.",
    ],
    catches:
      "Shallow or inconsistent review coverage across pull requests, especially when teams move quickly or rely heavily on generated code.",
  },
];

export const CODE_REVIEW_CUSTOMIZATION = [
  {
    name: "Repository instructions",
    summary:
      "Place review criteria, coding standards, and organization-wide expectations in .github/copilot-instructions.md so Copilot evaluates every PR against the same baseline.",
  },
  {
    name: "Repository context",
    summary:
      "Use AGENTS.md to explain intentional architecture, known sharp edges, and what your team considers a good implementation, so generated code is reviewed with project context.",
  },
  {
    name: "Path-specific guidance",
    summary:
      "Add .github/instructions/**/*.instructions.md files when different folders, languages, or subsystems need different review rules.",
  },
  {
    name: "MCP servers and skills",
    summary:
      "Copilot code review can use repository agent skills and MCP servers when relevant, including the GitHub and Playwright MCP servers enabled by default.",
  },
  {
    name: "Review environment",
    summary:
      "Use .github/workflows/copilot-code-review.yml for review-only setup, or reuse copilot-setup-steps.yml if the same environment should apply to both review and cloud-agent work.",
  },
  {
    name: "Firewall controls",
    summary:
      "Internet access for Copilot code review can be controlled separately from Copilot cloud agent, giving security teams a narrower boundary for automated review jobs.",
  },
];

export const CODE_REVIEW_NOTES = [
  {
    title: "Copilot does not replace human judgment",
    body:
      "By default, Copilot submits a Comment review rather than an approval that counts toward merge requirements, so teams can add AI feedback without weakening human review policy.",
  },
  {
    title: "Re-review matters after follow-up commits",
    body:
      "If automatic review of new pushes is not enabled, request a re-review after updating the PR so the latest generated or hand-written code gets another pass.",
  },
  {
    title: "Comments to Copilot are visible to humans, not to Copilot",
    body:
      "Treat Copilot's review threads as documentation for the team; the agent will not read or reply to thread comments the way a human reviewer would.",
  },
];

export const CODE_REVIEW_RESOURCES = [
  {
    title: "Using GitHub Copilot code review",
    url: "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review",
    description:
      "The main how-to for requesting reviews, enabling automatic review, re-reviewing pushes, and customizing how Copilot reviews pull requests.",
  },
  {
    title: "Configuring code review by GitHub Copilot",
    url: "https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-automatic-review",
    description:
      "Use this when you want every PR, or every new push to a PR, to trigger Copilot review automatically.",
  },
  {
    title: "About GitHub Copilot code review",
    url: "https://docs.github.com/en/copilot/concepts/agents/code-review",
    description:
      "Background on effort levels, approvals, GitHub Actions usage, and how code review behaves as an agentic capability.",
  },
];

export const AZURE_DEVOPS_REVIEW_EXAMPLE = {
  title: "Azure DevOps pipeline example",
  intro:
    "If your delivery workflow lives in Azure DevOps, you can still add a Copilot-powered review pass for pull requests. This sample checks out the PR head, computes the diff against the target branch, asks Copilot CLI for a concise review, and posts the result back to the GitHub pull request as a comment.",
  note:
    "This is a custom automation example for workshops and internal platforms, not the built-in GitHub Copilot code review feature described in the docs.",
  script: `# azure-pipelines.yml
pr:
  branches:
    include:
      - "*"

pool:
  vmImage: ubuntu-latest

steps:
  - checkout: self
    fetchDepth: 0

  - script: |
      npm install -g @github/copilot
      gh auth login --with-token < "$GITHUB_TOKEN_FILE"
      copilot auth login --github-token "$(cat "$GITHUB_TOKEN_FILE")"
    displayName: Install and authenticate GitHub tools
    env:
      GITHUB_TOKEN_FILE: $(Agent.TempDirectory)/github-token.txt

  - script: |
      set -euo pipefail

      git fetch origin "$SYSTEM_PULLREQUEST_TARGETBRANCH":"target-branch"

      git diff --unified=0 target-branch...HEAD > pr.diff

      copilot ask \
        --allow-tool=read \
        --message "$(cat <<'EOF'
Review the pull request diff in pr.diff.
Focus on correctness, regression risk, security issues, and missing tests.
Respond in markdown with:
- Summary
- Findings (severity + file/area + issue)
- Recommended next step
EOF
)" > copilot-review.md

      gh pr comment "$SYSTEM_PULLREQUEST_PULLREQUESTNUMBER" \
        --repo "$BUILD_REPOSITORY_NAME" \
        --body-file copilot-review.md
    displayName: Review PR diff and post comment
    env:
      GH_TOKEN: $(GitHubToken)
      GITHUB_TOKEN_FILE: $(Agent.TempDirectory)/github-token.txt`,
  details: [
    "Use a GitHub token with permission to comment on the pull request and access the repository contents.",
    "The example keeps Copilot on a read-only surface by allowing only read access for the review prompt.",
    "For richer formatting, emit a fixed markdown template so every pipeline comment is easy to scan.",
  ],
};

export const VERIFICATION_PILLARS = [
  {
    id: "unit-integration",
    icon: "🧪",
    title: "Unit and integration tests",
    accent: "#2563eb",
    summary:
      "These are the baseline gates for every PR. They should prove happy paths, failure paths, and cross-boundary behavior before anything merges.",
    checks: [
      "Run unit tests and integration tests on every PR.",
      "Publish code coverage so the agent can find missing tests around newly touched code.",
      "Cover positive cases, negative cases, permission failures, and contract drift between modules, services, databases, and APIs.",
    ],
    catches:
      "Missing test paths, broken contracts, weak validation coverage, and changes that compile but still break business behavior.",
  },
  {
    id: "parameterized",
    icon: "🧩",
    title: "Parameterized tests",
    accent: "#7c3aed",
    summary:
      "Use parameterized tests wherever the same rule must hold across many inputs, roles, configurations, or edge cases.",
    checks: [
      "Run parameterized tests on every PR wherever repeated scenarios can be expressed as data.",
      "Collapse repeated test logic into one reusable test shape with multiple cases.",
      "Apply them to validation rules, permission matrices, serialization cases, and business rules with many legal and illegal inputs.",
      "Keep the case list visible so the agent can expand coverage instead of cloning near-duplicate tests.",
    ],
    catches:
      "Forgotten permutations, inconsistent rule handling, and shallow test suites that only prove one representative example.",
  },
  {
    id: "ui",
    icon: "🎭",
    title: "End-to-end UI tests",
    accent: "#10b981",
    summary:
      "Full UI and end-to-end tests should run on every PR and cover real workflows in complicated apps, not just the easiest smoke path.",
    checks: [
      "Run full UI and end-to-end tests on every PR.",
      "Use Playwright for web apps to exercise navigation, auth, forms, async flows, and user-visible failure states.",
      "Use FlaUI for desktop apps to automate windows, dialogs, menus, permissions, and long-running UI interactions.",
      "Keep key journeys, risky regressions, and negative UI paths in the always-on PR suite.",
    ],
    catches:
      "Broken UI workflows, missing selectors, auth regressions, desktop interaction bugs, and API-to-UI mismatches that lower-level tests miss.",
  },
  {
    id: "architecture",
    icon: "🏗️",
    title: "Architecture tests",
    accent: "#f97316",
    summary:
      "Architecture tests keep new code in the right layers and stop shortcut implementations from landing in the wrong place.",
    checks: [
      "Use ArchUnitNET or NetArchTest.Rules to assert dependency direction, layer boundaries, namespaces, and naming conventions.",
      "Block domain-to-infrastructure leaks, UI-to-data shortcuts, and forbidden assembly references.",
      "Treat these rules as normal PR gates so structural violations fail as quickly as broken unit tests.",
    ],
    catches:
      "Layer leaks, circular dependencies, misplaced classes, and architectural drift that slowly makes the codebase harder to change.",
  },
];

export const DOTNET_ARCHITECTURE_OPTIONS = [
  {
    name: "ArchUnitNET",
    summary:
      "Use it for executable layer and dependency rules over assemblies, namespaces, slices, and architectural boundaries.",
  },
  {
    name: "NetArchTest.Rules",
    summary:
      "A lightweight way to enforce dependency direction, naming, and placement rules directly in your test projects.",
  },
];

export const VERIFICATION_STACK_ROWS = [
  {
    layer: "Unit and integration tests",
    requirement: "Always run on every PR",
    tooling: "Your standard test runner plus code coverage publishing",
    purpose:
      "Prove behavior, contracts, and failure handling in changed code and its dependencies.",
  },
  {
    layer: "Coverage reporting",
    requirement: "Always publish with the PR checks",
    tooling: "Coverage collectors and PR annotations",
    purpose:
      "Show the agent and reviewers where touched code still lacks tests.",
  },
  {
    layer: "Parameterized tests",
    requirement: "Use wherever behavior varies by input, role, or configuration",
    tooling: "Theory or data-driven test features in the repo's framework",
    purpose:
      "Expand breadth without duplicating test bodies or missing important combinations.",
  },
  {
    layer: "End-to-end UI tests",
    requirement: "Always run on every PR",
    tooling: "Playwright for web, FlaUI for desktop",
    purpose:
      "Validate the real app surface for complicated workflows on every PR, not just internal implementation details.",
  },
  {
    layer: "Architecture tests",
    requirement: "Always run on every PR",
    tooling: "ArchUnitNET or NetArchTest.Rules",
    purpose:
      "Fail fast when new code breaks architectural boundaries or placement rules.",
  },
];

export const VERIFICATION_NOTES = [
  {
    title: "Coverage is navigation, not vanity",
    body:
      "Expose coverage results in PR checks so the agent can see which changed branches, services, and screens still need tests before merge.",
  },
  {
    title: "UI tests must include hard paths",
    body:
      "Do not stop at happy-path clicks. Include auth failures, permission denials, recovery flows, and long-form workflows in Playwright or FlaUI coverage.",
  },
  {
    title: "Architecture tests protect against plausible shortcuts",
    body:
      "Agents often choose the nearest working edit. Architecture rules catch those seemingly successful changes when they land in the wrong layer or dependency direction.",
  },
];
