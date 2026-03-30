import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type ChartData = {
  time: number;
  price: number;
};

export function Chart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [livePrice, setLivePrice] = useState(0);
  const [livePrice24hChange, setLivePrice24hChange] = useState(0);
  const [days, setDays] = useState(1);
  const [chartError, setChartError] = useState("");
  const [isChartLoading, setIsChartLoading] = useState(false);
  const latestChartRequest = useRef(0);

  const buttons = [
    { label: "1D", value: 1 },
    { label: "1W", value: 7 },
    { label: "1M", value: 30 },
    { label: "1Y", value: 365 },
  ];

  async function getDailyData(selectedDays: number) {
    const requestId = Date.now();
    latestChartRequest.current = requestId;
    setIsChartLoading(true);
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${selectedDays}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (latestChartRequest.current === requestId) {
          setChartError("Failed to load chart data.");
          setChartData([]);
        }
        return;
      }
      const data = await response.json();
      const prices = Array.isArray(data?.prices) ? data.prices : [];

      if (latestChartRequest.current !== requestId) {
        return;
      }

      setChartData(
        prices.map(([timestamp, price]: [number, number]) => {
          return {
            time: timestamp,
            price,
          };
        }),
      );
      setChartError("");
    } catch {
      if (latestChartRequest.current === requestId) {
        setChartError("Network error while loading chart.");
        setChartData([]);
      }
    } finally {
      if (latestChartRequest.current === requestId) {
        setIsChartLoading(false);
      }
    }
  }

  useEffect(() => {
    getDailyData(days);

    const intervalId = setInterval(
      () => {
        getDailyData(days);
      },
      60 * 60 * 1000,
    );

    return () => clearInterval(intervalId);
  }, [days]);

  async function getBtcPrice() {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      if (!data?.bitcoin || typeof data.bitcoin.usd !== "number") {
        return false;
      }

      setLivePrice(data.bitcoin.usd);
      setLivePrice24hChange(data.bitcoin.usd_24h_change ?? 0);
      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number | undefined;

    const pollPrice = async () => {
      const ok = await getBtcPrice();
      if (!isMounted) return;
      timeoutId = window.setTimeout(pollPrice, ok ? 30 * 1000 : 2 * 60 * 1000);
    };

    pollPrice();

    return () => {
      isMounted = false;
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <>
      <div className="chart-header mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-lg font-bold">Bitcoin (BTC)</h2>
          <div className="flex flex-row gap-2 align-center">
            <p className="text-lg font-bold">{livePrice}$</p>
            <div className="flex flex-row gap-1 align-center">
              <p className="">{livePrice24hChange.toFixed(2)}%</p>
              {livePrice24hChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-[#00B65C]" />
              ) : (
                <TrendingDown className="h-4 w-4 text-[#FF3B5C]" />
              )}
            </div>
          </div>
        </div>
        <div className="chart-controls mb-3 flex flex-wrap justify-end gap-2">
          {buttons.map((button) => {
            return (
              <button
                key={button.value}
                className={`block h-[50%] rounded-lg border px-3 text-xs font-semibold tracking-wide transition-colors duration-200 ${
                  days === button.value
                    ? "border-[#00B65C] bg-[#00B65C] text-black"
                    : "border-[#1B232B] bg-[#0B1620] text-[#8C98A5] hover:border-[#00B65C] hover:text-[#00B65C]"
                }`}
                onClick={() => {
                  setDays(button.value);
                }}
              >
                {button.label}
              </button>
            );
          })}
        </div>
      </div>
      {chartError ? <p className="mb-2 text-sm text-[#FF3B5C]">{chartError}</p> : null}
      {isChartLoading && chartData.length === 0 ? <p className="mb-2 text-sm text-[#8C98A5]">Loading chart...</p> : null}
      <div className="chart-container w-full min-w-0 rounded-2xl border border-[#1B232B] bg-[#050D14] p-4">
        <div className="chart-scroll overflow-x-auto pb-1">
          <div className="chart-container-item h-[260px] min-w-[560px] sm:min-w-0">
            <div className="chart-container-item-bar h-[240px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#1B232B" vertical={false} />
                  <XAxis
                    type="number"
                    dataKey="time"
                    hide={true}
                    axisLine={false}
                    tickLine={false}
                    domain={["dataMin", "dataMax"]}
                  />
                  <YAxis
                    tick={{ fill: "#8C98A5", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    domain={([dataMin, dataMax]) => {
                      return [dataMin, dataMax];
                    }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ background: "#0B1620", border: "1px solid #1B232B", borderRadius: "10px" }}
                    labelStyle={{ color: "#8C98A5" }}
                    labelFormatter={(value) => {
                      const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                      return new Date(numericValue).toLocaleString();
                    }}
                    formatter={(value) => {
                      const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                      return [`$${numericValue.toLocaleString()}`, "Price"];
                    }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#00B65C" strokeWidth={2.5} dot={false} activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chart;
