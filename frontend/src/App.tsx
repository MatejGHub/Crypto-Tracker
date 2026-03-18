import { useState } from "react";
import { WishlistProvider } from "./context/WIshlistContext";
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
    <WishlistProvider>
      <main className="main-container flex h-screen overflow-hidden">
        <Aside activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "markets" && <Markets />}
        {activeTab === "watchlist" && <Watchlist />}
        {activeTab === "ai-insights" && <AiInsights />}
        {activeTab === "settings" && <Settings />}
      </main>
    </WishlistProvider>
  );
}

export default App;

/*
  CoinGecko endpoints by UI area:
  - Dashboard cards (global stats):
    https://api.coingecko.com/api/v3/global
    fields:
      data.total_market_cap.usd
      data.total_volume.usd
      data.market_cap_percentage.btc
      data.active_cryptocurrencies

  - Markets tab (coin rows):
    https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h

  - Search bar:
    https://api.coingecko.com/api/v3/search?query=bit

  - Coin chart widget:
    https://api.coingecko.com/api/v3/coins/{id}/market_chart?vs_currency=usd&days=30
    example:
    https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30

  - Coin id/symbol mapping:
    https://api.coingecko.com/api/v3/coins/list?include_platform=false
*/
