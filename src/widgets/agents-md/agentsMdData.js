// Distilled from "AGENTS.md Best Practices for AI Coding Assistants":
// https://gist.github.com/0xfauzi/7c8f65572930a21efa62623557d83f6e

export const HERO_POINTS = [
  { label: "Adoption", value: "20,000+ repos - standardized Aug 2025" },
  { label: "Budget", value: "~150 lines - link out for the rest" },
  { label: "Format", value: "Plain Markdown, no required schema" },
];

export const PRINCIPLES = [
  {
    id: "what-and-why",
    accent: "#6366f1",
    icon: "📄",
    title: "A \"README for machines\"",
    summary:
      "AGENTS.md is a dedicated Markdown file that complements, not replaces, README.md - detailed technical onboarding for an AI teammate instead of a human-facing overview.",
    points: [
      "README targets human developers; AGENTS.md gives agents exact commands, conventions, testing strategy, deployment workflow, and project-specific gotchas.",
      "It's an open, cross-tool standard formalized in August 2025 by OpenAI, Google, Cursor, Factory, and Sourcegraph, and now used by over 20,000 repositories.",
      "One file works across the whole ecosystem - OpenAI Codex, GitHub Copilot, Cursor, Claude Code, Aider, Gemini/Jules, Amp, Windsurf, Zed, RooCode - instead of a pile of tool-specific config files.",
    ],
    tip: "Payoff: agents skip a discovery phase, generated code matches your standards from the start, and review cycles shrink.",
  },
  {
    id: "placement-and-hierarchy",
    accent: "#0ea5e9",
    icon: "🗂️",
    title: "Placement and hierarchy",
    summary:
      "Put AGENTS.md at the repo root next to README.md. For monorepos, add nested AGENTS.md files per subproject - the nearest file in the directory tree wins.",
    points: [
      "Root file covers org-wide standards; each subdirectory file (backend/, infrastructure/, frontend/) covers its own stack and conventions.",
      "OpenAI's own repository uses this pattern with 88 AGENTS.md files spread across subcomponents.",
      "For tools that still look for their own filename, symlink it: ln -s AGENTS.md CLAUDE.md, ln -s AGENTS.md .github/copilot-instructions.md, ln -s AGENTS.md .cursorrules.",
    ],
  },
  {
    id: "essential-sections",
    accent: "#22c55e",
    icon: "🧱",
    title: "Essential sections, in priority order",
    summary:
      "Successful implementations converge on the same handful of sections - and the order matters, since this file is loaded into context up front, every session.",
    points: [
      "Development environment setup first: exact install/config commands and tool versions.",
      "Build and test commands second, with file-scoped commands preferred over full-suite ones for fast feedback.",
      "Code style and conventions third: formatting, naming, architecture choices, library preferences, explicit \"never do X\" rules.",
      "Testing instructions: framework, locations, coverage expectations, how to run unit vs. integration tests.",
      "Project structure and key files, so the agent doesn't have to rediscover the layout every session.",
      "Safety and permission boundaries: what's allowed without prompting vs. what needs approval first.",
      "PR and commit guidelines: title format, required checks before committing, expected diff size.",
    ],
  },
  {
    id: "command-first",
    accent: "#f59e0b",
    icon: "⚡",
    title: "Lead with commands, then show good vs. bad",
    summary:
      "The most effective AGENTS.md files lead with concrete commands rather than prose, and explicitly point to good and bad code examples instead of hoping the agent infers them.",
    points: [
      "Order: setup commands, then testing, then deployment, then debugging - concrete commands, not descriptions.",
      "Prefer file-scoped commands (lint/test/typecheck a single file) over full-suite ones, and mark full-suite commands \"only when explicitly requested\".",
      "Point to real files that demonstrate good patterns, and call out legacy or deprecated files to avoid, so the agent doesn't copy them by proximity.",
    ],
    example: {
      label: "Vague vs. concrete instructions",
      less: "Run the tests. Build it properly. Deploy carefully.",
      more:
        "Unit: `pytest tests/unit/` (fast, mocked). Integration: `pytest tests/integration/` (needs Docker). All: `pytest` - CI must pass before merge.",
    },
  },
  {
    id: "keep-it-short",
    accent: "#ec4899",
    icon: "✂️",
    title: "Keep it short; link out to details",
    summary:
      "Keep AGENTS.md to roughly 150 lines - it's loaded into every session's context, so excess length wastes tokens and buries what matters.",
    points: [
      "For large projects, split into nested AGENTS.md files per subdirectory instead of one giant root file.",
      "Some tools (e.g. Android Studio's Gemini integration) support file imports like @./docs/testing-patterns.md to pull in modular docs without inlining them.",
      "Don't paste entire API specs, architecture diagrams, or tutorials - link to docs/architecture.md and docs/api-reference.md instead.",
    ],
  },
  {
    id: "security",
    accent: "#f43f5e",
    icon: "🔒",
    title: "Never put secrets in AGENTS.md",
    summary:
      "GitHub identified 39 million leaked secrets in 2024, with AI-assisted projects showing a 40% increase in exposure - and AGENTS.md is a common place this happens.",
    points: [
      "Never include API keys, tokens, passwords, connection strings, cloud access keys, certificates, or production URLs/IPs - even as \"examples\".",
      "Document where secrets live and how to fetch them (e.g. a secrets manager namespace), never the secret values themselves.",
      "Environment variables aren't a safe substitute either - they're inherited by subprocesses and often end up in logs or crash reports; prefer a secrets manager or vault.",
    ],
    goldenRule:
      "Rule of thumb: if a value would ever need to be rotated after a leak, it doesn't belong in AGENTS.md - describe how to fetch it instead.",
  },
  {
    id: "common-mistakes",
    accent: "#8b5cf6",
    icon: "🚫",
    title: "Common mistakes to avoid",
    summary:
      "Beyond leaking secrets, most AGENTS.md problems trace back to a handful of repeated anti-patterns.",
    points: [
      "Overly verbose files (1000+ lines) that bury the important instructions - link out instead of inlining everything.",
      "Vague instructions like \"run the tests\" or \"build it properly\" instead of exact, copy-pasteable commands.",
      "Forcing full builds or test suites for every small change instead of offering fast, file-scoped commands.",
      "No stated permission boundaries, leaving it unclear what the agent can do autonomously versus what needs approval.",
      "No good/bad code examples, so the agent may copy legacy or deprecated patterns it finds nearby.",
      "Letting the file go stale - treat it like code: review it in PRs when processes change, and audit it periodically.",
      "One AGENTS.md for an entire monorepo instead of nested files scoped to each subproject.",
    ],
  },
  {
    id: "living-document",
    accent: "#14b8a6",
    icon: "🌱",
    title: "Start minimal, keep it living, balance safety",
    summary:
      "The best AGENTS.md files start small and evolve from real usage, stay in sync with the codebase, and clearly define when the agent should stop and ask.",
    points: [
      "Begin with 20-30 lines covering the most critical information: setup, testing, and code style. Add sections based on what the agent repeatedly gets wrong.",
      "Ask yourself: what would you tell a new teammate making their first change? Setup, make a change, test it, submit it - that's your outline.",
      "Update it in pull requests when processes change, review it during code review, and audit it quarterly - outdated instructions are worse than none.",
      "Balance automation and safety: file-scoped operations (lint/test a single file) can run automatically, while risky ones (installs, git pushes, infra changes) require approval.",
    ],
    tip: "Include guidance like \"when stuck, ask a clarifying question\" or \"if tests fail repeatedly, ask for human review\" - agents should know when to stop and ask for help.",
  },
  {
    id: "self-updating",
    accent: "#f97316",
    icon: "🔁",
    title: "Make AGENTS.md self-updating",
    summary:
      "State it explicitly in the root AGENTS.md: this file (and any nested ones) must be kept up to date as the codebase changes - then the guidelines adapt with your code \"for free\".",
    points: [
      "Add an instruction such as \"whenever you make a change that affects setup, commands, conventions, or structure described here, update AGENTS.md in the same change.\"",
      "This turns every feature PR into an opportunity for the agent to refresh its own onboarding doc, instead of relying on a human to remember later.",
      "It closes the loop from the earlier living-document advice: instead of only reviewing AGENTS.md in PRs, the agent proposes the update itself as part of the PR.",
    ],
    tip: "Pair it with a lightweight check: ask the agent to note in the PR description when it updated AGENTS.md, so reviewers know to double-check the diff.",
  },
];
