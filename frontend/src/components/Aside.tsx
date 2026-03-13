export function Aside({ setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <>
      <aside className="aside-container w-1/7 flex flex-col justify-between  h-screen">
        <div className="aside-header h-16 p-3 bg-[#05090D] text-white font-bold text-xl">CryptoTrack</div>
        <div className="aside-content p-3 border-2 border-black h-full bg-[#05090D] text-white">
          <input className="aside-content-item search" placeholder="Search assets..." type="text" />
          <div className="aside-content-item dashboard" onClick={() => setActiveTab("dashboard")}>
            Dashboard
          </div>
          <div className="aside-content-item markets" onClick={() => setActiveTab("markets")}>
            Markets
          </div>
          <div className="aside-content-item watchlist" onClick={() => setActiveTab("watchlist")}>
            Watchlist
          </div>
          <div className="aside-content-item ai-insights" onClick={() => setActiveTab("ai-insights")}>
            AI Insights
          </div>
          <div className="aside-content-item settings" onClick={() => setActiveTab("settings")}>
            Settings
          </div>
        </div>
        <div className="aside-footer p-3 h-16 border-2 border-black bg-[#05090D] text-white">Register</div>
      </aside>
    </>
  );
}

export default Aside;
