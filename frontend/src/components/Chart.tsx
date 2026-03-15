import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState, useEffect } from "react";

type ChartData = {
  time: string;
  price: number;
};

export function Chart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  async function getDailyData() {
    const url = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1";
    try {
      const response = await fetch(url);
      const data = await response.json();

      setChartData(
        data.prices.map(([timestamp, price]: [number, number]) => {
          return {
            time: new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            price,
          };
        }),
      );
      console.log(chartData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getDailyData();

    const intervalId = setInterval(
      () => {
        getDailyData();
      },
      60 * 60 * 1000,
    );

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="chart-container w-full rounded-2xl border border-[#1B232B] bg-[#050D14] p-4">
        <div className="chart-container-item h-64 w-full min-w-0">
          <div className="chart-container-item-bar h-full w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1B232B" vertical={false} />
                <XAxis dataKey="time" hide={true} axisLine={false} tickLine={false} />
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
                  formatter={(value) => {
                    const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                    return [`$${numericValue.toLocaleString()}`, "Price"];
                  }}
                />
                <Line type="monotone" dataKey="price" stroke="#00B65C" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chart;
