import { useMemo, useState } from "react";
import {
  FILE_TREE,
  FILE_CONTENTS,
  SKILL_MD_SECTIONS,
  GUIDE_HIGHLIGHTS,
  SOURCE_URL,
  GUIDE_URL,
} from "./skillData.js";
import "./SkillsVisualizerWidget.css";

const SKILL_MD_PATH = "excalidraw-diagram-generator/SKILL.md";

function extLanguage(name) {
  if (name.endsWith(".md")) return "markdown";
  if (name.endsWith(".py")) return "python";
  if (name.endsWith(".excalidraw") || name.endsWith(".json")) return "json";
  return "text";
}

function collectFilePaths(node, acc) {
  if (node.type === "file") acc.push(node);
  else node.children?.forEach((child) => collectFilePaths(child, acc));
  return acc;
}

function FileNode({ node, depth, selectedPath, onSelect, onHover, onLeave }) {
  const isFolder = node.type === "folder";
  const isSelected = node.path === selectedPath;

  return (
    <div className="skv__tree-item">
      <div
        className={
          "skv__node" +
          (isFolder ? " skv__node--folder" : "") +
          (isSelected ? " skv__node--selected" : "")
        }
        style={{ paddingLeft: `${depth * 1.05 + 0.4}rem` }}
        onClick={() => !isFolder && onSelect(node)}
        onMouseEnter={(e) => onHover(node, e)}
        onMouseMove={(e) => onHover(node, e)}
        onMouseLeave={onLeave}
        role={isFolder ? undefined : "button"}
        tabIndex={isFolder ? undefined : 0}
      >
        <span className="skv__node-icon">{isFolder ? "\uD83D\uDCC1" : "\uD83D\uDCC4"}</span>
        <span className="skv__node-name">{node.name}</span>
      </div>
      {isFolder &&
        node.children?.map((child) => (
          <FileNode
            key={child.path}
            node={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            onSelect={onSelect}
            onHover={onHover}
            onLeave={onLeave}
          />
        ))}
    </div>
  );
}

function FrontmatterBlock({ section, onHover, onLeave }) {
  return (
    <div className="skv__fm">
      <div className="skv__fm-fence">---</div>
      {section.fields.map((field) => (
        <div
          key={field.key}
          className="skv__fm-field"
          onMouseEnter={(e) => onHover(field.tooltip, e)}
          onMouseMove={(e) => onHover(field.tooltip, e)}
          onMouseLeave={onLeave}
        >
          <span className="skv__fm-key">{field.key}:</span>{" "}
          <span className="skv__fm-value">
            {field.key === "description" ? `'${field.value}'` : field.value}
          </span>
        </div>
      ))}
      <div className="skv__fm-fence">---</div>
    </div>
  );
}

function SkillMdView({ onHover, onLeave }) {
  return (
    <div className="skv__skillmd">
      {SKILL_MD_SECTIONS.map((section) => (
        <div
          key={section.id}
          className="skv__section"
          style={{ borderLeftColor: section.accent }}
        >
          <div
            className="skv__section-label"
            style={{ color: section.accent }}
            onMouseEnter={(e) => onHover(section.tooltip, e)}
            onMouseMove={(e) => onHover(section.tooltip, e)}
            onMouseLeave={onLeave}
          >
            {section.label}
          </div>
          {section.kind === "frontmatter" ? (
            <FrontmatterBlock section={section} onHover={onHover} onLeave={onLeave} />
          ) : (
            <pre className="skv__section-content">{section.content}</pre>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SkillsVisualizerWidget() {
  const allFiles = useMemo(() => collectFilePaths(FILE_TREE, []), []);
  const [selectedPath, setSelectedPath] = useState(SKILL_MD_PATH);
  const [tooltip, setTooltip] = useState(null); // { text, x, y }

  const selectedFile = allFiles.find((f) => f.path === selectedPath);
  const isSkillMd = selectedPath === SKILL_MD_PATH;
  const fileContent = FILE_CONTENTS[selectedPath];

  const showTooltip = (text, e) => {
    if (!text) return;
    setTooltip({ text, x: e.clientX, y: e.clientY });
  };
  const showNodeTooltip = (node, e) => showTooltip(node.purpose, e);
  const hideTooltip = () => setTooltip(null);

  return (
    <div className="skv">
      <p className="skv__intro">
        Skills package reusable capabilities - instructions, reference docs,
        templates and scripts - into one folder an agent can discover and
        invoke automatically. Below is a real, open-source example:{" "}
        <a href={SOURCE_URL} target="_blank" rel="noreferrer">
          excalidraw-diagram-generator
        </a>{" "}
        from github/awesome-copilot. Click a file on the left to read it, and
        hover any file or highlighted <code>SKILL.md</code> section for an
        explanation drawn from{" "}
        <a href={GUIDE_URL} target="_blank" rel="noreferrer">
          Creating Effective Skills
        </a>
        .
      </p>

      <div className="skv__guide">
        {GUIDE_HIGHLIGHTS.map((item) => (
          <div className="skv__guide-card" key={item.title}>
            <div className="skv__guide-title">{item.title}</div>
            <div className="skv__guide-body">{item.body}</div>
          </div>
        ))}
      </div>

      <div className="skv__panes">
        <section className="skv__pane skv__pane--files">
          <h2 className="skv__pane-title">{"\uD83D\uDCC1"} Skill folder</h2>
          <div className="skv__tree">
            <FileNode
              node={FILE_TREE}
              depth={0}
              selectedPath={selectedPath}
              onSelect={(node) => setSelectedPath(node.path)}
              onHover={showNodeTooltip}
              onLeave={hideTooltip}
            />
          </div>
        </section>

        <section className="skv__pane skv__pane--editor">
          <div className="skv__editor-header">
            <span className="skv__editor-path">{selectedFile?.path}</span>
            <span className="skv__editor-lang">
              {isSkillMd ? "markdown (annotated)" : extLanguage(selectedFile?.name ?? "")}
            </span>
          </div>
          {selectedFile?.purpose && (
            <div className="skv__editor-purpose">{selectedFile.purpose}</div>
          )}
          <div className="skv__editor-body">
            {isSkillMd ? (
              <SkillMdView onHover={showTooltip} onLeave={hideTooltip} />
            ) : (
              <pre className="skv__plain-content">{fileContent?.content}</pre>
            )}
          </div>
        </section>
      </div>

      {tooltip && (
        <div
          className="skv__tooltip"
          style={{ left: tooltip.x + 16, top: tooltip.y + 16 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
