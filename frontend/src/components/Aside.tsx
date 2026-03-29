import { LayoutDashboard, LineChart, Star, Settings, Sparkles } from "lucide-react";
import Register from "./content/Register";
import Search from "./content/Search";

export function Aside({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const itemClass = (tab: string) => {
    return `aside-content-item flex items-center gap-2 whitespace-nowrap text-sm font-medium md:text-[1rem] ${
      activeTab === tab ? "text-primary" : "text-[#7B8794]"
    }`;
  };

  return (
    <>
      <aside className="aside-container flex w-full flex-col border-b border-[#1B232B] md:h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="aside-header h-16 border-b border-[#1B232B] bg-[#05090D] p-3 text-xl font-bold text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary">
              <LineChart className="h-5 w-5 text-black" />
            </div>
            <span className="text-lg font-semibold tracking-tight">CryptoTrack</span>
          </div>
        </div>
        <div className="aside-content flex min-h-0 flex-1 flex-row gap-3 overflow-x-auto bg-[#05090D] p-3 text-white md:flex-col md:overflow-x-visible">
          <div className="search-container hidden md:block">
            <Search />
          </div>
          <button type="button" className={itemClass("dashboard")} onClick={() => setActiveTab("dashboard")}>
            <LayoutDashboard className="h-[21px] w-[21px]" />
            <span>Dashboard</span>
          </button>
          <button type="button" className={itemClass("markets")} onClick={() => setActiveTab("markets")}>
            <LineChart className="h-[21px] w-[21px]" />
            <span>Markets</span>
          </button>
          <button type="button" className={itemClass("watchlist")} onClick={() => setActiveTab("watchlist")}>
            <Star className="h-[21px] w-[21px]" />
            <span>Watchlist</span>
          </button>
          <button type="button" className={itemClass("ai-insights")} onClick={() => setActiveTab("ai-insights")}>
            <Sparkles className="h-[21px] w-[21px]" />
            <span>AI Insights</span>
          </button>
          <button type="button" className={itemClass("settings")} onClick={() => setActiveTab("settings")}>
            <Settings className="h-[21px] w-[21px]" />
            <span>Settings</span>
          </button>
        </div>
        <div className="aside-footer border-t border-[#1B232B] bg-[#05090D] p-3 text-white">
          <Register />
        </div>
      </aside>
    </>
  );
}

export default Aside;
