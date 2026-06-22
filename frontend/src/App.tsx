import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";

function App() {
  const [view, setView] = useState<"landing" | "dashboard">("landing");

  return (
    <>
      {view === "landing" ? (
        <LandingPage onNavigateToDashboard={() => setView("dashboard")} />
      ) : (
        <Dashboard onNavigateHome={() => setView("landing")} />
      )}
    </>
  );
}

export default App;
