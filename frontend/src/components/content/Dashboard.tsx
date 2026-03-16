import HeaderSettings from "../Header-settings";
import Chart from "../Chart";
import News from "../News";
import { useState, useEffect } from "react";
import { Activity, BarChart3, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import MarketData from "../MarketData";

export function Dashboard() {
  const [stats, setStats] = useState({
    totalMarketCap: 0,
    dailyVolume: 0,
    marketCapPercentage: 0,
    activeCryptos: 0,
  });
  const [prevStats, setPrevStats] = useState({
    totalMarketCap: 0,
    dailyVolume: 0,
    marketCapPercentage: 0,
    activeCryptos: 0,
  });

  async function getGlobalState() {
    const url = "https://api.coingecko.com/api/v3/global";
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPrevStats({
        totalMarketCap: stats.totalMarketCap,
        dailyVolume: stats.dailyVolume,
        marketCapPercentage: stats.marketCapPercentage,
        activeCryptos: stats.activeCryptos,
      });
      setStats({
        totalMarketCap: data.data.total_market_cap.usd,
        dailyVolume: data.data.total_volume.usd,
        marketCapPercentage: data.data.market_cap_percentage.btc,
        activeCryptos: data.data.active_cryptocurrencies,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getGlobalState();

    const id = setInterval(
      () => {
        getGlobalState();
      },
      60 * 60 * 1000,
    );

    return () => clearInterval(id);
  }, []);

  function showPercentage(current: number, previous: number) {
    if (!Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) {
      return "";
    }
    const change = ((current - previous) / previous) * 100;
    if (!Number.isFinite(change)) return "";
    return `${Math.abs(change).toFixed(1)}%`;
  }

  function getTrend(current: number, previous: number) {
    if (!Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) return "none";
    return current >= previous ? "up" : "down";
  }

  function getChangeClass(current: number, previous: number) {
    if (!Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) return "";
    return current >= previous ? "text-[#00D26A]" : "text-[#FF3B5C]";
  }

  const cards = [
    {
      title: "Total Market Cap",
      value: Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 1,
        notation: "compact",
      }).format(stats.totalMarketCap),
      change: showPercentage(stats.totalMarketCap, prevStats.totalMarketCap),
      trend: getTrend(stats.totalMarketCap, prevStats.totalMarketCap),
      changeClass: getChangeClass(stats.totalMarketCap, prevStats.totalMarketCap),
      Icon: DollarSign,
    },
    {
      title: "24h Volume",
      value: Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 1,
        notation: "compact",
      }).format(stats.dailyVolume),
      change: showPercentage(stats.dailyVolume, prevStats.dailyVolume),
      trend: getTrend(stats.dailyVolume, prevStats.dailyVolume),
      changeClass: getChangeClass(stats.dailyVolume, prevStats.dailyVolume),
      Icon: BarChart3,
    },
    {
      title: "BTC Cap %",
      value: `${Intl.NumberFormat("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(stats.marketCapPercentage)}%`,
      change: showPercentage(stats.marketCapPercentage, prevStats.marketCapPercentage),
      trend: getTrend(stats.marketCapPercentage, prevStats.marketCapPercentage),
      changeClass: getChangeClass(stats.marketCapPercentage, prevStats.marketCapPercentage),
      Icon: Activity,
    },
    { title: "Active Cryptos", value: stats.activeCryptos, change: "", trend: "none", changeClass: "", Icon: TrendingUp },
  ];

  return (
    <>
      <section className="dashboard-container w-full text-white h-screen flex flex-col">
        <div className="dashboard-header h-16 flex justify-between w-full p-3 bg-[#090E11] border-b border-[#1B232B]">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Dashboard</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="dashboard-content min-h-0 flex-1 overflow-y-auto border-b border-[#1B232B] bg-black p-3">
          <div className="dashboard-content info-cards grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ title, value, change, trend, changeClass, Icon }) => (
              <article key={title} className="rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071B14]">
                    <Icon className="h-5 w-5 text-[#00B65C]" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[1rem] text-[#8C98A5]">{title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[1.2rem] leading-none font-bold text-white">{value}</p>
                      {change ? (
                        <span className={`flex items-center gap-1 text-[1rem] font-semibold ${changeClass}`}>
                          {trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {change}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="dashboard-content-chart mt-3 flex w-full items-start gap-3">
            <div className="rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6 w-8/12 sticky top-0">
              <Chart />
            </div>
            <div className="rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6 w-4/12 sticky top-0">
              <News />
            </div>
          </div>
          <div className="market-container bg-[#050D14] mt-3 p-3 border rounded-2xl border-[#1B232B]">
            <MarketData />
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
