// Recurring failure modes teams hit when adopting agentic coding workflows,
// distilled into one pane per failure so each can be revealed and discussed
// on its own.

export const FAILURES = [
  {
    id: "context-rot",
    accent: "#f43f5e",
    icon: "🌀",
    title: "Context rot & scope creep",
    summary:
      "Failing to prune irrelevant ideas or past conversation threads causes the agent to constantly expand tasks, leading to over-engineered or disconnected features.",
    points: [
      "Stale threads, abandoned ideas, and old back-and-forth linger in context and keep influencing new work.",
      "An agent that can't tell what's still relevant tends to \"helpfully\" widen scope instead of staying on task.",
      "Symptoms: unrelated refactors, extra abstractions, and features nobody asked for showing up in a simple change.",
    ],
    goldenRule: "Context is a scarce resource - treat it as such!",
  },
  {
    id: "review-bottleneck",
    accent: "#f59e0b",
    icon: "🚧",
    title: "Review & maintenance bottlenecks",
    summary:
      "Agents accelerate the initial 20% of code-writing effort, but teams fail to scale the remaining 80% of review and maintenance capacity.",
    points: [
      "Generating code is now cheap; reading, reviewing, and understanding it is not - that bottleneck doesn't disappear, it moves.",
      "Faster authoring without faster review just relocates the backlog to pull requests instead of removing it.",
      "Maintenance (bug fixes, upgrades, small tweaks) still needs a human who understands what was actually built.",
    ],
    tip: "Invest in review throughput (checklists, smaller PRs, agent-assisted review) at the same pace you invest in generation speed.",
  },
  {
    id: "no-safety-net",
    accent: "#8b5cf6",
    icon: "🕳️",
    title: "No safety net",
    summary:
      "Not enough tests and missing architectural guidelines force the agent to guess how to solve things.",
    points: [
      "Without tests, the agent has no fast feedback loop to tell whether a change actually works.",
      "Without documented architecture or conventions, it has to infer patterns from whatever code it happens to read.",
      "Both gaps push the agent toward plausible-looking guesses instead of grounded, verifiable solutions.",
    ],
  },
  {
    id: "nitpicking",
    accent: "#0ea5e9",
    icon: "🔬",
    title: "Nitpicking over substance",
    summary:
      "Too much focus on technical details in the code than on the business requirements.",
    points: [
      "Reviewers (human or agent) can get absorbed in style, naming, and micro-optimizations while missing whether the feature is actually correct.",
      "Detailed feedback feels productive but can crowd out the higher-value question: does this solve the right problem?",
      "Keep review passes anchored to requirements and behavior first, formatting and micro-style second.",
    ],
  },
  {
    id: "no-plan",
    accent: "#22c55e",
    icon: "🗺️",
    title: "No plan!",
    summary:
      "Jumping straight to code on anything larger than a tiny bug fix leaves the agent (and you) without a shared direction.",
    points: [
      "Without a plan, the agent makes architectural decisions implicitly, one file at a time, instead of up front where they're cheap to change.",
      "A plan gives you a checkpoint to catch a bad approach before dozens of files are touched.",
    ],
    goldenRule: "Always use plan mode when implementing anything larger than a tiny bug fix!",
  },
];
