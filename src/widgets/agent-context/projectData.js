// Fake project data used to illustrate how a coding agent progressively
// builds up its context window: system prompt -> root AGENTS.md -> skills
// index -> MCP tools -> the user's prompt -> (prompt-driven) nested
// AGENTS.md -> full skill content -> @file reference content.
// Nothing here talks to a real filesystem or model - it's all fixture data
// for a workshop demo.

export const PROJECT_ROOT = "acme-shop";

// A typical small full-stack project layout. Two sub-folders each carry
// their own AGENTS.md, but only the one relevant to the user's prompt is
// ever read in this walkthrough - the frontend one is shown as a distractor.
export const FILE_TREE = {
  name: PROJECT_ROOT,
  type: "folder",
  path: PROJECT_ROOT,
  children: [
    {
      name: "AGENTS.md",
      type: "file",
      path: `${PROJECT_ROOT}/AGENTS.md`,
    },
    {
      name: ".mcp.json",
      type: "file",
      path: `${PROJECT_ROOT}/.mcp.json`,
    },
    {
      name: ".github",
      type: "folder",
      path: `${PROJECT_ROOT}/.github`,
      children: [
        {
          name: "skills",
          type: "folder",
          path: `${PROJECT_ROOT}/.github/skills`,
          children: [
            {
              name: "database-migration",
              type: "folder",
              path: `${PROJECT_ROOT}/.github/skills/database-migration`,
              children: [
                {
                  name: "SKILL.md",
                  type: "file",
                  path: `${PROJECT_ROOT}/.github/skills/database-migration/SKILL.md`,
                },
              ],
            },
            {
              name: "pdf-export",
              type: "folder",
              path: `${PROJECT_ROOT}/.github/skills/pdf-export`,
              children: [
                {
                  name: "SKILL.md",
                  type: "file",
                  path: `${PROJECT_ROOT}/.github/skills/pdf-export/SKILL.md`,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "src",
      type: "folder",
      path: `${PROJECT_ROOT}/src`,
      children: [
        {
          name: "components",
          type: "folder",
          path: `${PROJECT_ROOT}/src/components`,
          children: [
            { name: "AGENTS.md", type: "file", path: `${PROJECT_ROOT}/src/components/AGENTS.md` },
            { name: "App.jsx", type: "file", path: `${PROJECT_ROOT}/src/components/App.jsx` },
            { name: "CartSummary.jsx", type: "file", path: `${PROJECT_ROOT}/src/components/CartSummary.jsx` },
            { name: "ProductList.jsx", type: "file", path: `${PROJECT_ROOT}/src/components/ProductList.jsx` },
          ],
        },
        {
          name: "server",
          type: "folder",
          path: `${PROJECT_ROOT}/src/server`,
          children: [
            { name: "AGENTS.md", type: "file", path: `${PROJECT_ROOT}/src/server/AGENTS.md` },
            { name: "db.js", type: "file", path: `${PROJECT_ROOT}/src/server/db.js` },
            { name: "routes.js", type: "file", path: `${PROJECT_ROOT}/src/server/routes.js` },
          ],
        },
        { name: "index.js", type: "file", path: `${PROJECT_ROOT}/src/index.js` },
      ],
    },
    {
      name: "tests",
      type: "folder",
      path: `${PROJECT_ROOT}/tests`,
      children: [
        { name: "cart.test.js", type: "file", path: `${PROJECT_ROOT}/tests/cart.test.js` },
      ],
    },
    { name: "package.json", type: "file", path: `${PROJECT_ROOT}/package.json` },
    { name: "README.md", type: "file", path: `${PROJECT_ROOT}/README.md` },
  ],
};

export const SYSTEM_PROMPT = `You are a coding agent operating inside a developer's editor.
You can read and edit files, run commands, and call tools to complete tasks.
Always look for repository-level instructions and available skills or tools
before acting, and prefer the project's own conventions over your defaults.`;

export const AGENTS_MD_PATH = `${PROJECT_ROOT}/AGENTS.md`;
export const AGENTS_MD_CONTENT = `# AGENTS.md

## Project
Acme Shop - a small React + Node storefront.

## Conventions
- Use functional React components with hooks, no class components.
- Format currency with the shared \`formatMoney()\` helper, never toFixed().
- All server routes live in src/server/routes.js and must be covered by a test
  in tests/.
- Nested folders may contain their own AGENTS.md with more specific rules -
  read the one closest to the files you're changing.

## Testing
Run \`npm test\` before considering any change complete.`;

// Nested, folder-scoped AGENTS.md files. Only the one that covers the files
// touched by the current prompt gets loaded - the widget decides this by
// checking whether the prompt references a path under each folder.
export const SERVER_AGENTS_MD_PATH = `${PROJECT_ROOT}/src/server/AGENTS.md`;
export const SERVER_AGENTS_MD_CONTENT = `# AGENTS.md (src/server)

## Database access rules
- Never build SQL with string concatenation or template literals - always
  use parameterized queries (\`db.query(sql, params)\`).
- Any schema change needs a migration under \`.github/skills/database-migration\`
  and must be reversible.
- Keep query functions in db.js small and export one function per query.`;

export const COMPONENTS_AGENTS_MD_PATH = `${PROJECT_ROOT}/src/components/AGENTS.md`;
export const COMPONENTS_AGENTS_MD_CONTENT = `# AGENTS.md (src/components)

## UI rules
- Components must be accessible (proper labels, keyboard navigation).
- Keep components presentational; fetch data in hooks, not in JSX.`;

export const MCP_CONFIG_PATH = `${PROJECT_ROOT}/.mcp.json`;
export const MCP_SERVERS = [
  {
    id: "github",
    name: "github",
    command: "npx @modelcontextprotocol/server-github",
    tools: [
      { name: "search_issues", description: "Search issues and pull requests." },
      { name: "create_pull_request", description: "Open a pull request." },
    ],
  },
  {
    id: "postgres",
    name: "postgres",
    command: "npx @modelcontextprotocol/server-postgres",
    tools: [
      { name: "run_query", description: "Run a read-only SQL query against the shop database." },
      { name: "list_tables", description: "List tables and columns in the database." },
    ],
  },
];

export const SKILLS = [
  {
    id: "database-migration",
    name: "database-migration",
    path: `${PROJECT_ROOT}/.github/skills/database-migration/SKILL.md`,
    description:
      "How to write and run a new database migration for the shop schema, including rollback steps.",
    whenToUse: "Use when adding, changing, or removing a database table, column, or query.",
    content: `# SKILL: database-migration

## When to use
Use this skill whenever a task touches the database layer (src/server/db.js),
adds/changes a table or column, or asks for a query to be rewritten.

## Steps
1. Write a new migration file under \`migrations/\` with an \`up\` and \`down\` step.
2. Update the corresponding query function in \`src/server/db.js\` to use
   parameterized queries - never concatenate user input into SQL strings.
3. Run \`npm run migrate\` locally and confirm the \`down\` step cleanly reverts.
4. Add or update a test in \`tests/\` covering the new query shape.`,
  },
  {
    id: "pdf-export",
    name: "pdf-export",
    path: `${PROJECT_ROOT}/.github/skills/pdf-export/SKILL.md`,
    description: "How to generate a downloadable PDF invoice for a customer order.",
    whenToUse: "Use when a task involves exporting or printing an order as a PDF.",
    content: `# SKILL: pdf-export

## When to use
Use this skill when a task asks for an order or invoice to be exported or
printed as a PDF.

## Steps
1. Use the shared \`renderInvoicePdf(order)\` helper - do not add a new PDF
   library.
2. Stream the result back to the client with \`Content-Type: application/pdf\`.`,
  },
];

export const DB_JS_PATH = `${PROJECT_ROOT}/src/server/db.js`;
export const DB_JS_CONTENT = `// src/server/db.js
import { pool } from "./pool.js";

export async function getOrdersByCustomer(customerId) {
  // TODO: refactor - vulnerable to SQL injection, not parameterized.
  const sql = "SELECT * FROM orders WHERE customer_id = " + customerId;
  const { rows } = await pool.query(sql);
  return rows;
}

export async function getOrderById(orderId) {
  const sql = \`SELECT * FROM orders WHERE id = \${orderId}\`;
  const { rows } = await pool.query(sql);
  return rows[0];
}`;

// The user prompt explicitly references a file with @-syntax, and its
// wording ("database", "parameterized queries", "migration") is what the
// agent uses to decide which nested AGENTS.md and which skill are relevant.
export const USER_PROMPT = `Refactor @src/server/db.js to use parameterized queries instead of
string concatenation, and add a migration if the query shape changes.`;

// Ordered walkthrough of how the agent's context window is assembled.
// Each step optionally highlights file(s) in the tree and appends one
// block to the context panel. Steps after "user-prompt" only exist
// because of what the prompt said - they are the prompt-driven ones.
export const STEPS = [
  {
    id: "system-prompt",
    label: "Load system prompt",
    description: "The agent always starts with its base system prompt describing its role and tools.",
    highlightPaths: [],
    contextBlock: {
      kind: "system",
      title: "System prompt",
      subtitle: "Built-in, always present",
      content: SYSTEM_PROMPT,
    },
  },
  {
    id: "scan-agents-md",
    label: "Scan project root for AGENTS.md",
    description: "The agent looks in the repo root and finds AGENTS.md with project-specific instructions.",
    highlightPaths: [AGENTS_MD_PATH],
    contextBlock: {
      kind: "agents-md",
      title: "AGENTS.md",
      subtitle: AGENTS_MD_PATH,
      content: AGENTS_MD_CONTENT,
    },
  },
  {
    id: "discover-skills",
    label: "Discover Agent Skills",
    description:
      "The agent indexes .github/skills/ and adds a short summary of each skill (name + when to use it) to its context - full skill content is only loaded on demand.",
    highlightPaths: SKILLS.map((s) => s.path),
    contextBlock: {
      kind: "skills",
      title: "Agent Skills (index)",
      subtitle: `${SKILLS.length} skills discovered`,
      items: SKILLS,
    },
  },
  {
    id: "load-mcp",
    label: "Load MCP server tool definitions",
    description:
      "The agent reads .mcp.json, starts the configured MCP servers, and adds their tool schemas to its context.",
    highlightPaths: [MCP_CONFIG_PATH],
    contextBlock: {
      kind: "mcp",
      title: "MCP server tools",
      subtitle: `${MCP_SERVERS.length} servers connected`,
      items: MCP_SERVERS,
    },
  },
  {
    id: "user-prompt",
    label: "Receive user prompt",
    description:
      "The user's request is appended as the newest message. It references src/server/db.js with @-syntax and talks about databases and migrations - everything from here on is driven by that wording.",
    highlightPaths: [],
    contextBlock: {
      kind: "user",
      title: "User prompt",
      subtitle: "Newest message",
      content: USER_PROMPT,
    },
  },
  {
    id: "scan-nested-agents-md",
    label: "Scan src/server/ for a scoped AGENTS.md",
    description:
      "Because the prompt targets a file under src/server/, the agent walks up from that file and loads the nearest AGENTS.md it finds there - it does NOT load src/components/AGENTS.md, since nothing in the prompt touches that folder.",
    highlightPaths: [SERVER_AGENTS_MD_PATH],
    contextBlock: {
      kind: "agents-md",
      title: "AGENTS.md (scoped)",
      subtitle: SERVER_AGENTS_MD_PATH,
      content: SERVER_AGENTS_MD_CONTENT,
    },
  },
  {
    id: "load-relevant-skill",
    label: "Load the database-migration skill",
    description:
      "The prompt's wording (\"database\", \"parameterized queries\", \"migration\") matches the database-migration skill's \"when to use\" from the index above, so the agent now loads its full SKILL.md content. The unrelated pdf-export skill stays as just an index entry.",
    highlightPaths: [SKILLS[0].path],
    contextBlock: {
      kind: "skill-full",
      title: `Skill: ${SKILLS[0].name}`,
      subtitle: SKILLS[0].path,
      content: SKILLS[0].content,
    },
  },
  {
    id: "resolve-file-reference",
    label: "Resolve @src/server/db.js reference",
    description:
      "The @src/server/db.js mention in the prompt is a direct file reference, so the agent reads that file's current contents and adds them to the context verbatim - no guessing needed.",
    highlightPaths: [DB_JS_PATH],
    contextBlock: {
      kind: "file-ref",
      title: "@src/server/db.js",
      subtitle: "Referenced file contents",
      content: DB_JS_CONTENT,
    },
  },
];
