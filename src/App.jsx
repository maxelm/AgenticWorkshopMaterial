import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import WidgetPage from "./pages/WidgetPage.jsx";
import widgets from "./widgets/registry.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {widgets.map((widget) => (
          <Route
            key={widget.id}
            path={widget.path}
            element={<WidgetPage widget={widget} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
