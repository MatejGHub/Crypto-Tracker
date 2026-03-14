import { useState } from "react";
import Dashboard from "./components/content/Dashboard";
import Aside from "./components/Aside";
import Markets from "./components/content/Markets";
import Watchlist from "./components/content/Watchlist";
import AiInsights from "./components/content/AiInsights";
import Settings from "./components/content/Settings";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  return (
    <>
      <main className="main-container flex h-screen overflow-hidden">
        <Aside activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "markets" && <Markets />}
        {activeTab === "watchlist" && <Watchlist />}
        {activeTab === "ai-insights" && <AiInsights />}
        {activeTab === "settings" && <Settings />}
      </main>
    </>
  );
}

export default App;
