import HeaderSettings from "../Header-settings";
import { useContext } from "react";
import WishlistContext from "../../context/WIshlistContext";
import MarketDataContext from "../../context/MarketData";
import { Star } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";

function EmptyWatchlistCard() {
  return (
    <article className="max-w-md rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071B14]">
          <Star className="h-5 w-5 text-[#00B65C]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[1.1rem] font-bold text-white">Watchlist is empty</h2>
          <p className="text-sm text-[#8C98A5]">Star coins to add them to your watchlist.</p>
        </div>
      </div>
    </article>
  );
}

export function Watchlist() {
  const { isWishlisted } = useContext(WishlistContext) ?? { isWishlisted: new Set() };
  const { marketData } = useContext(MarketDataContext) ?? { marketData: [] };
  const watchlistCoins = marketData.filter((coin) => isWishlisted.has(coin.id));

  return (
    <>
      <section className="watchlist-container w-full text-white flex flex-col">
        <div className="watchlist-header h-16 flex justify-between w-full p-3 bg-[#090E11] border-b border-[#1B232B]">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Watchlist</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="watchlist-content bg-black p-3 flex-1 min-h-0 overflow-y-auto border-b border-[#1B232B]">
          {watchlistCoins.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <EmptyWatchlistCard />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {watchlistCoins.map((coin) => {
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
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
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
          )}
        </div>
      </section>
    </>
  );
}

export default Watchlist;
