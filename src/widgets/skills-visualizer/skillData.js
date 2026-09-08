// Fixture data for the Skills Visualizer widget.
//
// Content is adapted (and in places trimmed) from the real, open-source
// "excalidraw-diagram-generator" skill in the github/awesome-copilot repo:
//   https://github.com/github/awesome-copilot/tree/main/skills/excalidraw-diagram-generator
//
// Frontmatter/tooltip explanations are based on the "Creating Effective
// Skills" guide:
//   https://awesome-copilot.github.com/learning-hub/creating-effective-skills/

export const SOURCE_URL =
  "https://github.com/github/awesome-copilot/tree/main/skills/excalidraw-diagram-generator";
export const GUIDE_URL =
  "https://awesome-copilot.github.com/learning-hub/creating-effective-skills/#structure-your-skills";

const ROOT = "excalidraw-diagram-generator";

// --- File tree -------------------------------------------------------

export const FILE_TREE = {
  type: "folder",
  name: ROOT,
  path: ROOT,
  purpose:
    "The skill folder. Its name is kebab-case and matches the `name` field in SKILL.md - together they form the /excalidraw-diagram-generator slash command.",
  children: [
    {
      type: "file",
      name: "SKILL.md",
      path: `${ROOT}/SKILL.md`,
      purpose:
        "The skill's entry point. YAML frontmatter (name + description) lets Copilot discover the skill automatically; the body is the step-by-step instructions Copilot follows once invoked.",
    },
    {
      type: "folder",
      name: "references",
      path: `${ROOT}/references`,
      purpose:
        "Reference docs the model reads for authoritative facts (schemas, type tables) instead of guessing - this is what keeps generated output from hallucinating the file format.",
      children: [
        {
          type: "file",
          name: "excalidraw-schema.md",
          path: `${ROOT}/references/excalidraw-schema.md`,
          purpose:
            "Documents the top-level .excalidraw JSON schema (file wrapper, appState, the properties every element shares) so the model emits structurally valid files.",
        },
        {
          type: "file",
          name: "element-types.md",
          path: `${ROOT}/references/element-types.md`,
          purpose:
            "Per-element-type spec sheet (rectangle, ellipse, diamond, arrow, ...) with property tables, sizing guidance and JSON examples for each shape.",
        },
      ],
    },
    {
      type: "folder",
      name: "templates",
      path: `${ROOT}/templates`,
      purpose:
        "Starter .excalidraw files the model copies from and edits, rather than generating a whole diagram's JSON from scratch - fewer moving parts to get wrong.",
      children: [
        {
          type: "file",
          name: "flowchart-template.excalidraw",
          path: `${ROOT}/templates/flowchart-template.excalidraw`,
          purpose:
            "Starter file for sequential processes/decision trees: start/end ellipses, rectangle steps and diamond decision points already wired together.",
        },
        {
          type: "file",
          name: "er-diagram-template.excalidraw",
          path: `${ROOT}/templates/er-diagram-template.excalidraw`,
          purpose:
            "Starter file for database entity-relationship diagrams: entity boxes with attribute lists and relationship lines with cardinality labels.",
        },
        {
          type: "file",
          name: "class-diagram-template.excalidraw",
          path: `${ROOT}/templates/class-diagram-template.excalidraw`,
          purpose:
            "Starter file for OOP class diagrams: class boxes split into name/attributes/methods compartments, plus inheritance & composition arrow styles.",
        },
        {
          type: "file",
          name: "data-flow-diagram-template.excalidraw",
          path: `${ROOT}/templates/data-flow-diagram-template.excalidraw`,
          purpose:
            "Starter file for DFDs: external entities, process bubbles and data-store shapes connected by directional data-flow arrows.",
        },
        {
          type: "file",
          name: "business-flow-swimlane-template.excalidraw",
          path: `${ROOT}/templates/business-flow-swimlane-template.excalidraw`,
          purpose:
            "Starter file for swimlane diagrams: actor header columns with vertical lanes, ready for per-actor process boxes and cross-lane handoffs.",
        },
      ],
    },
    {
      type: "folder",
      name: "scripts",
      path: `${ROOT}/scripts`,
      purpose:
        "Small executable helpers the agent can run instead of hand-writing repetitive JSON edits - keeps output consistent and avoids re-deriving fiddly math (like arrow anchor points) every time.",
      children: [
        {
          type: "file",
          name: "README.md",
          path: `${ROOT}/scripts/README.md`,
          purpose:
            "Explains what each script does and the recommended workflow for using them together - the model reads this before deciding which script to run.",
        },
        {
          type: "file",
          name: "add-arrow.py",
          path: `${ROOT}/scripts/add-arrow.py`,
          purpose:
            "Adds a correctly-anchored arrow element between two existing shapes in a .excalidraw file, computing connection points so lines don't overlap shape interiors.",
        },
        {
          type: "file",
          name: "add-icon-to-diagram.py",
          path: `${ROOT}/scripts/add-icon-to-diagram.py`,
          purpose:
            "Inserts a library icon (e.g. an AWS service icon) into a diagram at a given position, wiring up its group id and bound text label.",
        },
        {
          type: "file",
          name: "split-excalidraw-library.py",
          path: `${ROOT}/scripts/split-excalidraw-library.py`,
          purpose:
            "Splits a large .excalidrawlib icon library into one small JSON file per icon plus a reference.md index, so the model only has to load the few icons it actually needs.",
        },
        {
          type: "file",
          name: ".gitignore",
          path: `${ROOT}/scripts/.gitignore`,
          purpose:
            "Keeps generated/scratch files (like split icon output during local testing) out of version control.",
        },
      ],
    },
  ],
};

// --- SKILL.md, broken into labeled/tooltipped sections ----------------

export const FRONTMATTER_FIELDS = [
  {
    key: "name",
    value: "excalidraw-diagram-generator",
    tooltip:
      "Kebab-case identifier that must match the folder name. It also becomes the slash-command users can type, e.g. /excalidraw-diagram-generator.",
  },
  {
    key: "description",
    value:
      'Generate Excalidraw diagrams from natural language descriptions. Use when asked to "create a diagram", "make a flowchart", "visualize a process", "draw a system architecture", "create a mind map", or "generate an Excalidraw file". Supports flowcharts, relationship diagrams, mind maps, and system architecture diagrams. Outputs .excalidraw JSON files that can be opened directly in Excalidraw.',
    tooltip:
      "10-1024 characters, wrapped in quotes. This is the single most important field for agent discovery: the agent matches a user's request against this text to decide whether to invoke the skill, so it should read like \"what it does\" + \"when to use it\", packed with the trigger phrases users actually type.",
  },
];

export const SKILL_MD_SECTIONS = [
  {
    id: "frontmatter",
    kind: "frontmatter",
    label: "YAML frontmatter",
    accent: "#8250df",
    tooltip:
      "Machine-readable metadata between the --- fences. This is what an agent scans (often across dozens of skills) before ever reading the body - get this part wrong and the skill is never discovered.",
    fields: FRONTMATTER_FIELDS,
  },
  {
    id: "title",
    kind: "heading",
    label: "Title & intro",
    accent: "#57606a",
    tooltip:
      "A one-line human-readable restatement of the skill. Not parsed specially by agents, but the first thing a person skimming the repo sees.",
    content:
      "# Excalidraw Diagram Generator\n\nA skill for generating Excalidraw-format diagrams from natural language descriptions. This skill helps create visual representations of processes, systems, relationships, and ideas without manual drawing.",
  },
  {
    id: "when-to-use",
    kind: "section",
    label: "When to Use This Skill",
    accent: "#0969da",
    tooltip:
      '"Add \'When to Use\' guidance" is one of the guide\'s core tips: an explicit bullet list of trigger phrases and supported cases gives agent discovery a second, more skimmable chance beyond the frontmatter description alone.',
    content:
      '## When to Use This Skill\n\nUse this skill when users request:\n\n- "Create a diagram showing..."\n- "Make a flowchart for..."\n- "Visualize the process of..."\n- "Draw the system architecture of..."\n- "Generate a mind map about..."\n- "Create an Excalidraw file for..."\n- "Show the relationship between..."\n- "Diagram the workflow of..."\n\n**Supported diagram types:**\n- \uD83D\uDCCA **Flowcharts**: Sequential processes, workflows, decision trees\n- \uD83D\uDD17 **Relationship Diagrams**: Entity relationships, system components, dependencies\n- \uD83E\uDDE0 **Mind Maps**: Concept hierarchies, brainstorming results, topic organization\n- \uD83C\uDFD7\uFE0F **Architecture Diagrams**: System design, module interactions, data flow\n- \uD83D\uDCC8 **Data Flow Diagrams (DFD)**: Data flow visualization, data transformation processes\n- \uD83C\uDFCA **Business Flow (Swimlane)**: Cross-functional workflows, actor-based process flows\n- \uD83D\uDCE6 **Class Diagrams**: Object-oriented design, class structures and relationships\n- \uD83D\uDD04 **Sequence Diagrams**: Object interactions over time, message flows\n- \uD83D\uDDC3\uFE0F **ER Diagrams**: Database entity relationships, data models',
  },
  {
    id: "workflow",
    kind: "section",
    label: "Step-by-Step Workflow",
    accent: "#1a7f37",
    tooltip:
      'The guide calls this out as tip #1 & #3: "start with clear objectives" and "define requirements explicitly". A numbered workflow turns a vague request into a deterministic procedure the agent can execute the same way every time.',
    content:
      "## Step-by-Step Workflow\n\n### Step 1: Understand the Request\n\nAnalyze the user's description to determine:\n1. **Diagram type** (flowchart, relationship, mind map, architecture)\n2. **Key elements** (entities, steps, concepts)\n3. **Relationships** (flow, connections, hierarchy)\n4. **Complexity** (number of elements)\n\n### Step 2: Choose the Appropriate Diagram Type\n\n| User Intent | Diagram Type | Example Keywords |\n|-------------|--------------|-------------------|\n| Process flow, steps, procedures | **Flowchart** | \"workflow\", \"process\", \"steps\" |\n| Connections, dependencies | **Relationship Diagram** | \"relationship\", \"dependencies\" |\n| Database design | **ER Diagram** | \"database\", \"entity\", \"data model\" |\n\n### Step 3: Extract Structured Information\n\n**For Flowcharts:** list of sequential steps, decision points, start/end points.\n**For ER Diagrams:** entities with attributes, relationships with cardinality.\n\n### Step 4: Generate the .excalidraw File\n\nStart from the closest matching template, then add/edit elements following the schema in references/excalidraw-schema.md and references/element-types.md.",
  },
  {
    id: "asset-refs",
    kind: "section",
    label: "Bundled asset references",
    accent: "#0d8a8a",
    tooltip:
      'Tip #4 from the guide: "Reference bundled assets" - link straight to the relative path of each template/reference/script so the agent knows these files exist and opens them instead of inventing the format from memory.',
    content:
      "## Reference Files\n\nFor detailed schema information, see:\n- [references/excalidraw-schema.md](references/excalidraw-schema.md) - Complete JSON schema\n- [references/element-types.md](references/element-types.md) - Element type specifications with examples\n\n## Templates\n\nStart from a template instead of writing JSON from scratch:\n- [templates/flowchart-template.excalidraw](templates/flowchart-template.excalidraw)\n- [templates/er-diagram-template.excalidraw](templates/er-diagram-template.excalidraw)\n- [templates/class-diagram-template.excalidraw](templates/class-diagram-template.excalidraw)\n\n## Scripts\n\nFor icon libraries, use [scripts/split-excalidraw-library.py](scripts/split-excalidraw-library.py) - see scripts/README.md for the full workflow.",
  },
];

// --- Plain file contents for everything except SKILL.md ---------------

export const FILE_CONTENTS = {
  [`${ROOT}/references/excalidraw-schema.md`]: {
    language: "markdown",
    content:
      '# Excalidraw JSON Schema Reference\n\nThis document describes the structure of Excalidraw `.excalidraw` files for diagram generation.\n\n## Top-Level Structure\n\n```typescript\ninterface ExcalidrawFile {\n  type: "excalidraw";\n  version: number;           // Always 2\n  source: string;            // "https://excalidraw.com"\n  elements: ExcalidrawElement[];\n  appState: AppState;\n  files: Record<string, any>; // Usually empty {}\n}\n```\n\n## AppState\n\n```typescript\ninterface AppState {\n  viewBackgroundColor: string; // Hex color, e.g., "#ffffff"\n  gridSize: number;            // Typically 20\n}\n```\n\n## ExcalidrawElement Base Properties\n\nAll elements share these common properties:\n\n```typescript\ninterface BaseElement {\n  id: string;\n  type: ElementType;\n  x: number;\n  y: number;\n  width: number;\n  height: number;\n  strokeColor: string;\n  backgroundColor: string;\n  fillStyle: "solid" | "hachure" | "cross-hatch";\n  strokeWidth: number;\n  roughness: number;            // 0-2, hand-drawn effect (1 = default)\n  opacity: number;              // 0-100\n  seed: number;                 // Deterministic rendering\n  version: number;\n  isDeleted: boolean;\n}\n```\n\n(…trimmed for this demo - the full reference continues with every\nremaining base property and per-type overrides.)',
  },
  [`${ROOT}/references/element-types.md`]: {
    language: "markdown",
    content:
      '# Excalidraw Element Types Guide\n\nDetailed specifications for each Excalidraw element type with visual examples and use cases.\n\n## Element Type Overview\n\n| Type | Visual | Primary Use | Text Support |\n|------|--------|-------------|--------------|\n| `rectangle` | \u25A1 | Boxes, containers, process steps | Yes |\n| `ellipse` | \u25CB | Emphasis, terminals, states | Yes |\n| `diamond` | \u25C7 | Decision points, choices | Yes |\n| `arrow` | \u2192 | Directional flow, relationships | No (use separate text) |\n| `line` | \u2014 | Connections, dividers | No |\n| `text` | A | Labels, annotations, titles | (its purpose) |\n\n## Rectangle\n\n**Best for:** Process steps, entities, data stores, components\n\n### Size Guidelines\n\n| Content | Width | Height |\n|---------|-------|--------|\n| Single word | 120-150px | 60-80px |\n| Short phrase | 180-220px | 80-100px |\n| Sentence | 250-300px | 100-120px |\n\n### Example\n\n```json\n{\n  "type": "rectangle",\n  "x": 100,\n  "y": 100,\n  "width": 200,\n  "height": 80,\n  "backgroundColor": "#b2f2bb",\n  "text": "Validate Input",\n  "fontSize": 20,\n  "textAlign": "center",\n  "verticalAlign": "middle",\n  "roundness": { "type": 3 }\n}\n```\n\n(…trimmed for this demo - continues with Ellipse, Diamond, Arrow, Line\nand Text element specs.)',
  },
  [`${ROOT}/templates/flowchart-template.excalidraw`]: {
    language: "json",
    content:
      '{\n  "type": "excalidraw",\n  "version": 2,\n  "source": "https://excalidraw.com",\n  "elements": [\n    {\n      "id": "start",\n      "type": "ellipse",\n      "x": 80, "y": 40, "width": 120, "height": 60,\n      "backgroundColor": "#d0f0c0",\n      "text": "Start"\n    },\n    {\n      "id": "step1",\n      "type": "rectangle",\n      "x": 60, "y": 160, "width": 160, "height": 80,\n      "backgroundColor": "#b2f2bb",\n      "text": "Do the thing"\n    },\n    {\n      "id": "decision",\n      "type": "diamond",\n      "x": 40, "y": 300, "width": 200, "height": 100,\n      "text": "OK?"\n    }\n    /* …trimmed: remaining branches + end node */\n  ],\n  "appState": { "viewBackgroundColor": "#ffffff", "gridSize": 20 },\n  "files": {}\n}',
  },
  [`${ROOT}/templates/er-diagram-template.excalidraw`]: {
    language: "json",
    content:
      '{\n  "type": "excalidraw",\n  "version": 2,\n  "source": "https://excalidraw.com",\n  "elements": [\n    {\n      "id": "entity-user",\n      "type": "rectangle",\n      "x": 80, "y": 60, "width": 220, "height": 140,\n      "text": "User\\n---\\nid: uuid\\nemail: text\\ncreated_at: timestamp"\n    },\n    {\n      "id": "entity-order",\n      "type": "rectangle",\n      "x": 400, "y": 60, "width": 220, "height": 140,\n      "text": "Order\\n---\\nid: uuid\\nuser_id: uuid\\ntotal: decimal"\n    },\n    {\n      "id": "rel-user-order",\n      "type": "arrow",\n      "x": 300, "y": 130, "width": 100, "height": 0,\n      "text": "1..*"\n    }\n  ],\n  "appState": { "viewBackgroundColor": "#ffffff", "gridSize": 20 },\n  "files": {}\n}',
  },
  [`${ROOT}/templates/class-diagram-template.excalidraw`]: {
    language: "json",
    content:
      '{\n  "type": "excalidraw",\n  "version": 2,\n  "source": "https://excalidraw.com",\n  "elements": [\n    {\n      "id": "class-name",\n      "type": "rectangle",\n      "x": 100, "y": 60, "width": 40, "height": 220,\n      "text": "Animal"\n    },\n    {\n      "id": "class-attrs",\n      "type": "text",\n      "x": 100, "y": 100, "width": 220, "height": 60,\n      "text": "- name: string\\n- age: int"\n    },\n    {\n      "id": "class-methods",\n      "type": "text",\n      "x": 100, "y": 170, "width": 220, "height": 60,\n      "text": "+ speak(): void"\n    },\n    {\n      "id": "inherit-arrow",\n      "type": "arrow",\n      "x": 210, "y": 300, "width": 0, "height": 100,\n      "strokeStyle": "solid"\n    }\n  ],\n  "appState": { "viewBackgroundColor": "#ffffff", "gridSize": 20 },\n  "files": {}\n}',
  },
  [`${ROOT}/templates/data-flow-diagram-template.excalidraw`]: {
    language: "json",
    content:
      '{\n  "type": "excalidraw",\n  "version": 2,\n  "source": "https://excalidraw.com",\n  "elements": [\n    {\n      "id": "ext-user",\n      "type": "rectangle",\n      "x": 40, "y": 40, "width": 160, "height": 70,\n      "text": "Customer (external)"\n    },\n    {\n      "id": "process-checkout",\n      "type": "ellipse",\n      "x": 280, "y": 40, "width": 180, "height": 90,\n      "text": "1. Process Checkout"\n    },\n    {\n      "id": "store-orders",\n      "type": "line",\n      "x": 560, "y": 60, "width": 160, "height": 0,\n      "text": "D1: Orders store"\n    }\n  ],\n  "appState": { "viewBackgroundColor": "#ffffff", "gridSize": 20 },\n  "files": {}\n}',
  },
  [`${ROOT}/templates/business-flow-swimlane-template.excalidraw`]: {
    language: "json",
    content:
      '{\n  "type": "excalidraw",\n  "version": 2,\n  "source": "https://excalidraw.com",\n  "elements": [\n    {\n      "id": "lane-header-sales",\n      "type": "rectangle",\n      "x": 0, "y": 0, "width": 240, "height": 50,\n      "text": "Sales"\n    },\n    {\n      "id": "lane-header-warehouse",\n      "type": "rectangle",\n      "x": 240, "y": 0, "width": 240, "height": 50,\n      "text": "Warehouse"\n    },\n    {\n      "id": "lane-sales",\n      "type": "line",\n      "x": 0, "y": 50, "width": 0, "height": 400\n    },\n    {\n      "id": "task-quote",\n      "type": "rectangle",\n      "x": 30, "y": 90, "width": 180, "height": 70,\n      "text": "Create quote"\n    }\n  ],\n  "appState": { "viewBackgroundColor": "#ffffff", "gridSize": 20 },\n  "files": {}\n}',
  },
  [`${ROOT}/scripts/README.md`]: {
    language: "markdown",
    content:
      "# Excalidraw Library Tools\n\nThis directory contains scripts for working with Excalidraw libraries.\n\n## split-excalidraw-library.py\n\nSplits an Excalidraw library file (`*.excalidrawlib`) into individual icon JSON files for efficient token usage by AI assistants.\n\n### Usage\n\n```bash\npython split-excalidraw-library.py <path-to-library-directory>\n```\n\n### What the Script Does\n\n1. **Reads** the `.excalidrawlib` file\n2. **Extracts** each icon from the `libraryItems` array\n3. **Sanitizes** icon names to create valid filenames\n4. **Saves** each icon as a separate JSON file in the `icons/` directory\n5. **Generates** a `reference.md` file mapping icon names to filenames\n\n### Benefits\n\n- **Token Efficiency**: the AI reads the lightweight `reference.md` first, then loads only the specific icon files it needs\n- **Organization**: icons are organized in a clear directory structure\n\n(…trimmed for this demo; see add-arrow.py / add-icon-to-diagram.py for\nthe other two helper scripts referenced from SKILL.md.)",
  },
  [`${ROOT}/scripts/add-arrow.py`]: {
    language: "python",
    content:
      '#!/usr/bin/env python3\n"""Add a correctly-anchored arrow between two existing elements in a\n.excalidraw file, computing connection points on each shape\'s boundary\nso the line does not overlap either shape\'s interior.\n\nUsage:\n    python add-arrow.py diagram.excalidraw --from rect1 --to rect2 \\\n        --label "depends on"\n"""\n\nimport json\nimport sys\nimport argparse\n\n\ndef find_element(elements, element_id):\n    for el in elements:\n        if el["id"] == element_id:\n            return el\n    raise KeyError(f"No element with id {element_id!r}")\n\n\ndef anchor_point(element, towards):\n    """Return the point on `element`\'s edge closest to `towards`."""\n    cx = element["x"] + element["width"] / 2\n    cy = element["y"] + element["height"] / 2\n    # …trimmed: real implementation clips the line from (cx, cy) to\n    # `towards` against the element\'s bounding box.\n    return cx, cy\n\n\ndef main():\n    parser = argparse.ArgumentParser()\n    parser.add_argument("file")\n    parser.add_argument("--from", dest="from_id", required=True)\n    parser.add_argument("--to", dest="to_id", required=True)\n    parser.add_argument("--label", default="")\n    args = parser.parse_args()\n\n    with open(args.file) as f:\n        data = json.load(f)\n\n    src = find_element(data["elements"], args.from_id)\n    dst = find_element(data["elements"], args.to_id)\n    sx, sy = anchor_point(src, dst)\n    ex, ey = anchor_point(dst, src)\n\n    data["elements"].append({\n        "id": f"arrow-{args.from_id}-{args.to_id}",\n        "type": "arrow",\n        "x": sx, "y": sy,\n        "width": ex - sx, "height": ey - sy,\n        "text": args.label,\n    })\n\n    with open(args.file, "w") as f:\n        json.dump(data, f, indent=2)\n\n\nif __name__ == "__main__":\n    main()',
  },
  [`${ROOT}/scripts/add-icon-to-diagram.py`]: {
    language: "python",
    content:
      '#!/usr/bin/env python3\n"""Insert a previously-split library icon (see\nsplit-excalidraw-library.py) into a diagram at a given position,\nwiring up its group id and bound text label.\n\nUsage:\n    python add-icon-to-diagram.py diagram.excalidraw \\\n        --icon libraries/aws-architecture-icons/icons/EC2.json \\\n        --x 400 --y 120 --label "Web server"\n"""\n\nimport json\nimport argparse\nimport uuid\n\n\ndef main():\n    parser = argparse.ArgumentParser()\n    parser.add_argument("file")\n    parser.add_argument("--icon", required=True)\n    parser.add_argument("--x", type=float, required=True)\n    parser.add_argument("--y", type=float, required=True)\n    parser.add_argument("--label", default="")\n    args = parser.parse_args()\n\n    with open(args.file) as f:\n        diagram = json.load(f)\n    with open(args.icon) as f:\n        icon_elements = json.load(f)\n\n    group_id = str(uuid.uuid4())\n    for el in icon_elements:\n        el["x"] += args.x\n        el["y"] += args.y\n        el["groupIds"] = [group_id]\n        diagram["elements"].append(el)\n\n    if args.label:\n        diagram["elements"].append({\n            "id": f"label-{group_id}",\n            "type": "text",\n            "x": args.x, "y": args.y + 70,\n            "text": args.label,\n            "groupIds": [group_id],\n        })\n\n    with open(args.file, "w") as f:\n        json.dump(diagram, f, indent=2)\n\n\nif __name__ == "__main__":\n    main()',
  },
  [`${ROOT}/scripts/split-excalidraw-library.py`]: {
    language: "python",
    content:
      '#!/usr/bin/env python3\n"""Split an Excalidraw library file (*.excalidrawlib) into individual\nicon JSON files plus a reference.md index, so an AI assistant only has\nto load the specific icons it needs instead of the entire library.\n\nUsage:\n    python split-excalidraw-library.py <path-to-library-directory>\n"""\n\nimport json\nimport re\nimport sys\nfrom pathlib import Path\n\n\ndef sanitize(name):\n    return re.sub(r"[^a-zA-Z0-9-]+", "-", name).strip("-")\n\n\ndef main():\n    library_dir = Path(sys.argv[1])\n    lib_file = next(library_dir.glob("*.excalidrawlib"))\n    data = json.loads(lib_file.read_text())\n\n    icons_dir = library_dir / "icons"\n    icons_dir.mkdir(exist_ok=True)\n\n    rows = []\n    for item in data["libraryItems"]:\n        name = item.get("name") or item["id"]\n        filename = f"{sanitize(name)}.json"\n        (icons_dir / filename).write_text(json.dumps(item["elements"], indent=2))\n        rows.append((name, f"icons/{filename}"))\n\n    reference = library_dir / "reference.md"\n    lines = ["# Icon reference\\n", "| Icon | File |", "|------|------|"]\n    lines += [f"| {name} | {path} |" for name, path in rows]\n    reference.write_text("\\n".join(lines))\n\n    print(f"Wrote {len(rows)} icons + reference.md")\n\n\nif __name__ == "__main__":\n    main()',
  },
  [`${ROOT}/scripts/.gitignore`]: {
    language: "text",
    content: "# Local scratch output from manual testing\n*.tmp.excalidraw\n__pycache__/\n*.pyc\n",
  },
};

export const GUIDE_HIGHLIGHTS = [
  {
    title: "Skills are self-contained folders",
    body:
      "A SKILL.md file plus optional bundled assets (references, templates, scripts) packaged into a single unit agents can discover automatically and users can invoke via slash commands.",
  },
  {
    title: "Frontmatter drives discovery",
    body:
      "name is a kebab-case identifier matching the folder name and doubling as the /command. description (10-1024 chars) is what agents match against a user's request - write it with concrete trigger phrases, not a vague label.",
  },
  {
    title: "Bundle what matters",
    body:
      "Reference docs, starter templates and small scripts reduce hallucination and repetition - the agent reads/edits/runs them instead of re-deriving the same schema or math from memory every time.",
  },
  {
    title: "One purpose per skill",
    body:
      "Keep a skill focused on a single task or workflow, and reference bundled assets explicitly from the instructions (e.g. \"see references/x.md\") so the agent knows they exist.",
  },
];
