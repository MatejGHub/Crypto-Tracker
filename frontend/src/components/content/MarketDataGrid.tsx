import MarketDataContext from "../../context/MarketData";
import { useContext } from "react";
import WishlistContext from "../../context/WIshlistContext";
import { Star } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function MarketDataGrid() {
  const { marketData } = useContext(MarketDataContext) ?? { marketData: [] };
  const { isWishlisted, setIsWishlisted } = useContext(WishlistContext) ?? { isWishlisted: new Set(), setIsWishlisted: () => {} };

  function toggleWishlist(id: string) {
    setIsWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("wishlisted", JSON.stringify(Array.from(next)));
      return next;
    });
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {marketData.map((coin) => {
          const sparklineData = (coin.sparkline_in_7d?.price ?? []).map((price: number, index: number) => {
            return {
              index,
              price: Number(price),
            };
          });

          return (
            <article className="rounded-2xl border border-[#1B232B] bg-[#050D14] p-5" key={coin.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">{coin.name}</h2>
                    <p className="text-md text-[#8C98A5]">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={() => toggleWishlist(coin.id)}>
                  <Star
                    className={`h-5 w-5 ${isWishlisted.has(coin.id) ? "fill-yellow-500 text-yellow-500" : "text-[#8C98A5]"}`}
                  />
                </button>
              </div>

              <div className="mt-4 flex items-end gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold text-white">${coin.current_price.toLocaleString("en-US")}</p>
                  <p
                    className={`text-xl font-semibold ${coin.price_change_percentage_24h > 0 ? "text-[#00B65C]" : "text-[#FF3B5C]"}`}
                  >
                    {coin.price_change_percentage_24h > 0 ? "+" : ""}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
                <div className="h-12 w-40 min-w-[10rem] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData}>
                      <Line
                        type="linear"
                        dataKey="price"
                        stroke={coin.price_change_percentage_24h > 0 ? "#00B65C" : "#FF3B5C"}
                        strokeWidth={2.5}
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
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default MarketDataGrid;
