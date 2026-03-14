import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartData = [
  { time: "Mon", price: 44120 },
  { time: "Tue", price: 64880 },
  { time: "Wed", price: 64340 },
  { time: "Thu", price: 25210 },
  { time: "Fri", price: 66780 },
  { time: "Sat", price: 46110 },
  { time: "Sun", price: 27234 },
];

export function Chart() {
  return (
    <>
      <div className="chart-container rounded-2xl border border-[#1B232B] bg-[#050D14] p-4">
        <div className="chart-container-item h-64 w-full">
          <div className="chart-container-item-bar h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#1B232B" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: "#8C98A5", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#8C98A5", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
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
