import { Link } from "react-router-dom";

export default function WidgetPage({ widget }) {
  const WidgetComponent = widget.component;

  return (
    <div className="widget-page">
      <Link className="widget-page__back" to="/">
        ← Back to dashboard
      </Link>
      <h1>
        {widget.icon} {widget.title}
      </h1>
      <WidgetComponent />
    </div>
  );
}
