import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { WishlistProvider } from "./context/WIshlistContext";
import { MarketDataProvider } from "./context/MarketData";
import Dashboard from "./components/content/Dashboard";
import Aside from "./components/Aside";
import Markets from "./components/content/Markets";
import Watchlist from "./components/content/Watchlist";
import AiInsights from "./components/content/AiInsights";
import Settings from "./components/content/Settings";
import NotFound from "./pages/404";
import SingleCrypto from "./pages/singleCrypto";
import "./App.css";

function pathToTab(pathname: string): string {
  if (pathname === "/" || pathname === "/dashboard") return "dashboard";
  const seg = pathname.replace(/^\//, "").split("/")[0] ?? "";
  if (["markets", "watchlist", "ai-insights", "settings"].includes(seg)) return seg;
  return "dashboard";
}

function tabToPath(tab: string): string {
  switch (tab) {
    case "dashboard":
      return "/";
    case "markets":
      return "/markets";
    case "watchlist":
      return "/watchlist";
    case "ai-insights":
      return "/ai-insights";
    case "settings":
      return "/settings";
    default:
      return "/";
  }
}

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = pathToTab(location.pathname);

  return (
    <WishlistProvider>
      <MarketDataProvider>
        <main className="main-container flex h-screen overflow-hidden">
          <Aside activeTab={activeTab} setActiveTab={(tab) => navigate(tabToPath(tab))} />
          <Outlet />
        </main>
      </MarketDataProvider>
    </WishlistProvider>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="markets" element={<Markets />} />
        <Route path="watchlist" element={<Watchlist />} />
        <Route path="ai-insights" element={<AiInsights />} />
        <Route path="settings" element={<Settings />} />
        <Route path="crypto/:coinId" element={<SingleCrypto />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
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
