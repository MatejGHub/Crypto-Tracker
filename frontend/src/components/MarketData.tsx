import { Sparkles, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function MarketData() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [isWishlisted, setIsWishlisted] = useState<Set<string>>(new Set());

  function toggleWishlist(id: string) {
    setIsWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("wishlisted", JSON.stringify(Array.from(next)));
      return next;
    });
  }

  async function getMarketData() {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h,7d";
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const loadMarketData = async () => {
      const data = await getMarketData();
      setMarketData(data ?? []);
    };

    loadMarketData();

    const id = setInterval(loadMarketData, 1000 * 60 * 60 * 24);

    return () => clearInterval(id);
  }, []);

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
      <div className="table-container">
        <table className="w-full mt-3">
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
              <td className="py-2">Wishlist</td>
            </tr>
          </thead>
          <tbody>
            {marketData.map((singleMarketData) => {
              return (
                <tr key={singleMarketData.id}>
                  <td className="border-t border-[#1B232B] py-2 text-[#8C98A5]">{singleMarketData.market_cap_rank}</td>
                  <td className="border-t border-[#1B232B] py-2 flex flex-row gap-2 items-center">
                    <img src={singleMarketData.image} alt={singleMarketData.name} className="w-6 h-6" />
                    <span>
                      {singleMarketData.name}
                      <p className="text-sm text-[#8C98A5]">{singleMarketData.symbol.toUpperCase()}</p>
                    </span>
                  </td>
                  <td className="border-t border-[#1B232B] py-2">${singleMarketData.current_price.toLocaleString("en-US")}</td>
                  <td
                    className={`border-t border-[#1B232B] py-2 ${singleMarketData.price_change_percentage_24h > 0 ? "text-[#00B65C]" : "text-[#FF3B5C]"}`}
                  >
                    {singleMarketData.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="border-t border-[#1B232B] py-2">
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(singleMarketData.market_cap)}
                  </td>
                  <td className="border-t border-[#1B232B] py-2">
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(singleMarketData.total_volume)}
                  </td>
                  <td className="border-t border-[#1B232B] py-2">
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(singleMarketData.circulating_supply)}
                  </td>
                  <td className="border-t border-[#1B232B] py-2">
                    <div className="h-12 w-28">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
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
                            stroke={singleMarketData.price_change_percentage_24h > 0 ? "#00B65C" : "#FF3B5C"}
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
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="border-t border-[#1B232B] py-2">
                    <button onClick={() => toggleWishlist(singleMarketData.id)}>
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
