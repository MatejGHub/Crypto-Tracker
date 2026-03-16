import { Sparkles } from "lucide-react";

export function MarketData() {
  return (
    <div className="flex flex-row gap-2">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071B14]">
        <Sparkles className="h-5 w-5 text-[#00B65C]" />
      </div>
      <div className="flex flex-col">
        <h2 className="text-lg font-bold">Market Data</h2>
        <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
      </div>
    </div>
  );
}

export default MarketData;
