import { LayoutDashboard, LineChart, Star, Settings, Sparkles } from "lucide-react";

export function Aside({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const itemClass = (tab: string) => {
    return `aside-content-item flex items-center gap-2 text-[1rem] font-medium ${activeTab === tab ? "text-primary" : "text-[#7B8794]"}`;
  };

  return (
    <>
      <aside className="aside-container w-1/7 flex h-screen flex-col border-r border-[#1B232B]">
        <div className="aside-header h-16 p-3 bg-[#05090D] text-white font-bold text-xl border-b border-[#1B232B]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary">
              <LineChart className="h-5 w-5 text-black" />
            </div>
            <span className="text-lg font-semibold tracking-tight">CryptoTrack</span>
          </div>
        </div>
        <div className="aside-content flex-1 min-h-0 bg-[#05090D] p-3 text-white flex flex-col gap-3">
          <div className="search-container">
            <input className="aside-content-item search" placeholder="Search assets..." type="text" />
          </div>
          <div className={itemClass("dashboard")} onClick={() => setActiveTab("dashboard")}>
            <LayoutDashboard className="h-[21px] w-[21px]" />
            <span>Dashboard</span>
          </div>
          <div className={itemClass("markets")} onClick={() => setActiveTab("markets")}>
            <LineChart className="h-[21px] w-[21px]" />
            <span>Markets</span>
          </div>
          <div className={itemClass("watchlist")} onClick={() => setActiveTab("watchlist")}>
            <Star className="h-[21px] w-[21px]" />
            <span>Watchlist</span>
          </div>
          <div className={itemClass("ai-insights")} onClick={() => setActiveTab("ai-insights")}>
            <Sparkles className="h-[21px] w-[21px]" />
            <span>AI Insights</span>
          </div>
          <div className={itemClass("settings")} onClick={() => setActiveTab("settings")}>
            <Settings className="h-[21px] w-[21px]" />
            <span>Settings</span>
          </div>
        </div>
        <div className="aside-footer p-3 h-16 bg-[#05090D] text-white border-t border-[#1B232B]">Register</div>
      </aside>
    </>
  );
}

export default Aside;
