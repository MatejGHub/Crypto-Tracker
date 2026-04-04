import { Sparkles, Star } from "lucide-react";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import WishlistContext from "../context/WIshlistContext";
import { useContext, useEffect, useState } from "react";
import MarketDataContext from "../context/MarketData";
import { useNavigate } from "react-router-dom";

export function MarketData() {
  const { isWishlisted, setIsWishlisted } = useContext(WishlistContext) ?? { isWishlisted: new Set(), setIsWishlisted: () => {} };
  const { marketData } = useContext(MarketDataContext) ?? { marketData: [] };
  const [watchlistError, setWatchlistError] = useState("");
  const navigate = useNavigate();

  function formatCompactUsd(value: unknown) {
    if (typeof value !== "number") return "—";
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }

  function formatUsd(value: unknown) {
    if (typeof value !== "number") return "—";
    return `$${value.toLocaleString("en-US")}`;
  }

  function toggleWishlist(id: string) {
    setIsWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("wishlisted", JSON.stringify(Array.from(next)));
      return next;
    });
  }

  function navigateToCrypto(id: string) {
    navigate(`/crypto/${id}`);
  }

  function getAuthToken() {
    const auth = JSON.parse(sessionStorage.getItem("auth") ?? "{}");
    return auth?.token ?? null;
  }

  async function storeWatchlistItems(coinId: string) {
    const token = getAuthToken();
    if (!token) {
      setWatchlistError("Please log in to edit your watchlist.");
      return false;
    }
    try {
      const url = "/api/watchlist";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coin_id: coinId,
        }),
      });
      if (response.ok) {
        setWatchlistError("");
        return true;
      }
      setWatchlistError("Failed to add coin to watchlist.");
      return false;
    } catch {
      setWatchlistError("Network error while updating watchlist.");
      return false;
    }
  }

  async function removeWatchlistItem(coinId: string) {
    const token = getAuthToken();
    if (!token) {
      setWatchlistError("Please log in to edit your watchlist.");
      return false;
    }
    try {
      const url = `/api/watchlist/${coinId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setWatchlistError("");
        return true;
      }
      setWatchlistError("Failed to remove coin from watchlist.");
      return false;
    } catch {
      setWatchlistError("Network error while updating watchlist.");
      return false;
    }
  }

  async function handleWatchlistClick(coinId: string) {
    const isAlreadyWishlisted = isWishlisted.has(coinId);
    const success = isAlreadyWishlisted ? await removeWatchlistItem(coinId) : await storeWatchlistItems(coinId);
    if (success) {
      toggleWishlist(coinId);
    }
  }

  useEffect(() => {
    const getWatchlistItems = async () => {
      const token = getAuthToken();
      if (!token) return;
      const url = "/api/watchlist";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const items = Array.isArray(data?.items) ? data.items : [];
        setIsWishlisted(new Set(items));
        localStorage.setItem("wishlisted", JSON.stringify(items));
      } else {
        setWatchlistError("Failed to load watchlist.");
      }
    };
    getWatchlistItems();
  }, [setIsWishlisted]);

  return (
    <>
      <div className="flex flex-row gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071B14]">
          <Sparkles className="h-5 w-5 text-[#00B65C]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">Market Data</h2>

          <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
        </div>
      </div>
      {watchlistError ? <p className="mt-2 text-sm text-[#FF3B5C]">{watchlistError}</p> : null}
      <div className="table-container mt-3 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr>
              <td className="py-2">#</td>
              <td className="py-2">Name</td>
              <td className="py-2">Price</td>
              <td className="py-2">24h Change</td>
              <td className="py-2">Market Cap</td>
              <td className="py-2">Volume</td>
              <td className="py-2">Supply</td>
              <td className="py-2">Last 7 days</td>
              <td className="py-2">Watchlist</td>
            </tr>
          </thead>
          <tbody>
            {marketData.length === 0 ? (
              <tr>
                <td className="border-t border-[#1B232B] py-6 text-center text-sm text-[#8C98A5]" colSpan={9}>
                  Market data is temporarily unavailable.
                </td>
              </tr>
            ) : null}
            {marketData.map((singleMarketData) => {
              const priceChange24h =
                typeof singleMarketData.price_change_percentage_24h === "number"
                  ? singleMarketData.price_change_percentage_24h
                  : null;
              const isPositiveChange = priceChange24h !== null && priceChange24h > 0;
              return (
                <tr key={singleMarketData.id} onClick={() => navigateToCrypto(singleMarketData.id)}>
                  <td className="border-t border-[#1B232B] py-2 text-[#8C98A5]">{singleMarketData.market_cap_rank}</td>
                  <td className="border-t border-[#1B232B] py-2 flex flex-row gap-2 items-center">
                    <img src={singleMarketData.image} alt={singleMarketData.name} className="w-6 h-6" />
                    <span>
                      {singleMarketData.name}
                      <p className="text-sm text-[#8C98A5]">{singleMarketData.symbol.toUpperCase()}</p>
                    </span>
                  </td>
                  <td className="border-t border-[#1B232B] py-2">{formatUsd(singleMarketData.current_price)}</td>
                  <td className={`border-t border-[#1B232B] py-2 ${isPositiveChange ? "text-[#00B65C]" : "text-[#FF3B5C]"}`}>
                    {priceChange24h !== null ? `${priceChange24h.toFixed(2)}%` : "—"}
                  </td>
                  <td className="border-t border-[#1B232B] py-2">{formatCompactUsd(singleMarketData.market_cap)}</td>
                  <td className="border-t border-[#1B232B] py-2">{formatCompactUsd(singleMarketData.total_volume)}</td>
                  <td className="border-t border-[#1B232B] py-2">{formatCompactUsd(singleMarketData.circulating_supply)}</td>
                  <td className="border-t border-[#1B232B] py-2">
                    <div className="h-12 w-28">
                      <LineChart
                        width={112}
                        height={48}
                        margin={{ top: 2, right: 0, left: 0, bottom: 2 }}
                        data={(singleMarketData.sparkline_in_7d?.price ?? []).map((price: number, index: number) => {
                          return {
                            index,
                            price: Number(price),
                          };
                        })}
                      >
                        <Line
                          type="linear"
                          dataKey="price"
                          stroke={isPositiveChange ? "#00B65C" : "#FF3B5C"}
                          strokeWidth={2}
                          dot={false}
                          activeDot={false}
                        />
                        <XAxis
                          type="number"
                          dataKey="index"
                          hide={true}
                          axisLine={false}
                          tickLine={false}
                          domain={["dataMin", "dataMax"]}
                        />
                        <YAxis
                          hide={true}
                          axisLine={false}
                          tickLine={false}
                          domain={([dataMin, dataMax]) => {
                            if (dataMin === dataMax) {
                              return [dataMin - 1, dataMax + 1];
                            }
                            const padding = (dataMax - dataMin) * 0.05;
                            return [dataMin - padding, dataMax + padding];
                          }}
                        />
                      </LineChart>
                    </div>
                  </td>
                  <td className="border-t border-[#1B232B] py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleWatchlistClick(singleMarketData.id);
                      }}
                    >
                      <Star
                        className={`h-4 w-4 ${isWishlisted.has(singleMarketData.id) ? "fill-yellow-500 text-yellow-500" : ""}`}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MarketData;
