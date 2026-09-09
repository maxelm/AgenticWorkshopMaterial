// Content distilled from Anthropic's "Prompting best practices" guide,
// "General principles" section only, generalized from Claude-specific
// wording to apply to LLM agents in general:
// https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#general-principles

export const PRINCIPLES = [
  {
    id: "clear-direct",
    accent: "#6366f1",
    icon: "🎯",
    title: "Be clear and direct",
    summary:
      "Agents respond well to explicit instructions. Spell out the output you want instead of hoping the model infers it.",
    points: [
      "Think of an agent as a brilliant, new employee who lacks context on your norms and workflows - explain precisely what you want.",
      "If you want \"above and beyond\" behavior, ask for it explicitly rather than relying on the agent to guess.",
      "Be specific about the desired output format and any constraints.",
      "Provide instructions as sequential, numbered or bulleted steps when order or completeness matters.",
    ],
    goldenRule:
      "Golden rule: show your prompt to a colleague with minimal context and ask them to follow it. If they'd be confused, the agent will be too.",
    example: {
      label: "Creating an analytics dashboard",
      less: "Create an analytics dashboard",
      more:
        "Create an analytics dashboard. Include as many relevant features and interactions as possible. Go beyond the basics to create a fully-featured implementation.",
    },
  },
  {
    id: "add-context",
    accent: "#0ea5e9",
    icon: "🧩",
    title: "Add context to improve performance",
    summary:
      "Explain the motivation behind an instruction. A capable agent can generalize from the \"why,\" which leads to more targeted responses.",
    points: [
      "Providing context or motivation for an instruction helps the agent understand your goals rather than just the letter of the rule.",
      "This lets the agent generalize sensibly instead of following a rule rigidly in cases you didn't anticipate.",
    ],
    example: {
      label: "Formatting preferences",
      less: "NEVER use ellipses",
      more:
        "Your response will be read aloud by a text-to-speech engine, so never use ellipses since the text-to-speech engine will not know how to pronounce them.",
    },
  },
  {
    id: "use-examples",
    accent: "#22c55e",
    icon: "📎",
    title: "Use examples effectively",
    summary:
      "Few-shot / multishot prompting - a handful of well-crafted examples - is one of the most reliable ways to steer format, tone, and structure.",
    points: [
      "Relevant: mirror your actual use case closely.",
      "Diverse: cover edge cases and vary enough that the agent doesn't pick up unintended patterns.",
      "Structured: wrap examples in <example> tags (<examples> for multiple) so the agent can distinguish them from instructions.",
    ],
    tip: "Include 3-5 examples for best results. You can also ask the agent to evaluate your examples for relevance and diversity, or generate more from your initial set.",
  },
  {
    id: "xml-tags",
    accent: "#f59e0b",
    icon: "🏷️",
    title: "Structure prompts with XML tags",
    summary:
      "XML tags help an agent parse complex prompts unambiguously, especially when instructions, context, examples, and variable inputs are mixed together.",
    points: [
      "Wrap each type of content in its own tag, e.g. <instructions>, <context>, <input>, to reduce misinterpretation.",
      "Use consistent, descriptive tag names across your prompts.",
      "Nest tags when content has a natural hierarchy, e.g. documents inside <documents>, each inside <document index=\"n\">.",
    ],
  },
  {
    id: "give-role",
    accent: "#ec4899",
    icon: "🎭",
    title: "Give the agent a role",
    summary:
      "Setting a role in the system prompt focuses an agent's behavior and tone for your use case. Even a single sentence makes a difference.",
    points: [
      "A short system prompt like \"You are a helpful coding assistant specializing in Python\" shapes tone, depth, and focus for the whole conversation.",
      "Roles are cheap to add and can meaningfully sharpen responses for a specific domain or audience.",
    ],
  },
  {
    id: "long-context",
    accent: "#8b5cf6",
    icon: "📚",
    title: "Long context prompting",
    summary:
      "For large documents or data-rich inputs (20k+ tokens), where and how you place content changes result quality.",
    points: [
      "Put longform data at the top: place long documents/inputs above your query, instructions, and examples - queries at the end can improve response quality by up to 30% on complex, multi-document inputs.",
      "Structure document content and metadata with XML tags: wrap each document in <document> tags with <document_content> and <source> (and other metadata) subtags.",
      "Ground responses in quotes: for long-document tasks, ask the agent to quote the relevant parts of the documents first before carrying out its task, to focus it on relevant content.",
    ],
  },
  {
    id: "keep-context-small",
    accent: "#f43f5e",
    icon: "🧹",
    title: "Keep your context small",
    summary:
      "Favor several short, focused sessions over one long-running one. A smaller context keeps the agent sharper and its answers more reliable.",
    points: [
      "As a session grows, older instructions and details get crowded out, so the agent's answers get less reliable.",
      "A good rule of thumb: keep each session to only 1-3 prompts before wrapping up and starting fresh.",
    ],
    tip: "Bonus: a smaller context window also costs fewer credits per prompt.",
  },
];
