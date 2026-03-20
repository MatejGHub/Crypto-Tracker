import { TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Activity, BarChart3, DollarSign } from "lucide-react";

export function Cards() {
  // Global market data
  const [stats, setStats] = useState({
    totalMarketCap: 0,
    dailyVolume: 0,
    marketCapPercentage: 0,
    activeCryptos: 0,
  });

  // Previous fetched global market data
  const [prevStats, setPrevStats] = useState({
    totalMarketCap: 0,
    dailyVolume: 0,
    marketCapPercentage: 0,
    activeCryptos: 0,
  });

  // Fetch global market data
  async function getGlobalState() {
    const url = "https://api.coingecko.com/api/v3/global";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      if (!data?.data?.total_market_cap?.usd) {
        return false;
      }
      const nextStats = {
        totalMarketCap: data.data.total_market_cap.usd,
        dailyVolume: data.data.total_volume.usd,
        marketCapPercentage: data.data.market_cap_percentage.btc,
        activeCryptos: data.data.active_cryptocurrencies,
      };
      setStats((currentStats) => {
        setPrevStats(currentStats);
        return nextStats;
      });
      return true;
    } catch {
      return false;
    }
  }

  // Fetch global market data every hour
  useEffect(() => {
    let isMounted = true;
    let timeoutId: number | undefined;

    const pollGlobalState = async () => {
      const ok = await getGlobalState();
      if (!isMounted) return;
      timeoutId = window.setTimeout(pollGlobalState, ok ? 60 * 60 * 1000 : 2 * 60 * 1000);
    };

    pollGlobalState();

    return () => {
      isMounted = false;
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Functions below are used to calculate the trend and percentage of market data
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

  // Cards data structure
  const cards = [
    {
      title: "Total Market Cap",
      value: Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
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
    </>
  );
}

export default Cards;
