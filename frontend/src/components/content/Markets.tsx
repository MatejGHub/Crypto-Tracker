import HeaderSettings from "../Header-settings";
import MarketData from "../MarketData";
import Cards from "./Cards";
import MarketDataGrid from "./MarketDataGrid";
import { useState } from "react";

export function Markets() {
  const [isGrid, setIsGrid] = useState(false);

  function toggleGrid() {
    setIsGrid(!isGrid);
  }
  return (
    <>
      <section className="markets-container flex h-full w-full min-h-0 flex-col overflow-y-auto bg-black text-white">
        <div className="markets-header flex h-16 w-full items-center justify-between border-b border-[#1B232B] bg-[#090E11] px-3">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Markets</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="min-h-0 flex-1">
          <div className="dashboard-content border-[#1B232B] bg-black p-3">
            <Cards />
          </div>

          <div className="markets-content bg-black flex-1 min-h-0 border-[#1B232B] pb-3">
            <div className="market-container mx-3 rounded-2xl border border-[#1B232B] bg-[#050D14] p-3">
              <button onClick={toggleGrid} className="mb-3 bg-[#050D14] border border-[#1B232B] rounded-md p-2">
                {isGrid ? "Grid view" : "List view"}
              </button>
              {isGrid ? <MarketDataGrid /> : <MarketData />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Markets;
