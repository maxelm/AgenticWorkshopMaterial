import { Link } from "react-router-dom";
import widgets from "../widgets/registry.js";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Agentic AI Workshop Tools</h1>
        <p>
          A collection of small widgets used to demonstrate how things work
          behind the scenes when working with agentic coding and LLMs.
        </p>
      </header>

      <div className="dashboard__grid">
        {widgets.map((widget) => (
          <Link
            key={widget.id}
            to={widget.path}
            className="dashboard__card"
          >
            <span className="dashboard__card-icon">{widget.icon}</span>
            <h2>{widget.title}</h2>
            <p>{widget.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
