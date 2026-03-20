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
      <section className="bg-black markets-container w-full text-white h-screen min-h-0 flex flex-col">
        <div className="markets-header h-16 flex justify-between w-full p-3 bg-[#090E11] border-[#1B232B]">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Markets</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="overflow-y-auto">
          <div className="dashboard-content border-[#1B232B] bg-black p-3">
            <Cards />
          </div>

          <div className="markets-content bg-black flex-1 min-h-0 border-[#1B232B] pb-3">
            <div className="market-container bg-[#050D14] ml-3 mr-3 p-3 border rounded-2xl border-[#1B232B]">
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
