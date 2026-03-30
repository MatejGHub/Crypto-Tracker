import HeaderSettings from "../Header-settings";
import Chart from "../Chart";
import News from "../News";
import MarketData from "../MarketData";
import Cards from "./Cards";

export function Dashboard() {
  return (
    <>
      <section className="dashboard-container flex h-full w-full min-h-0 flex-col overflow-y-auto bg-black text-white">
        <div className="dashboard-header flex h-16 w-full items-center justify-between border-b border-[#1B232B] bg-[#090E11] px-3">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Dashboard</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="dashboard-content min-h-0 flex-1 border-b border-[#1B232B] bg-black p-3">
          <Cards />
          <div className="dashboard-content-chart mt-3 flex w-full flex-col items-start gap-3 xl:flex-row">
            <div className="w-full rounded-2xl border border-[#1B232B] bg-[#050D14] px-4 py-5 xl:w-8/12 xl:px-5 xl:py-6">
              <Chart />
            </div>
            <div className="w-full rounded-2xl border border-[#1B232B] bg-[#050D14] px-4 py-5 xl:w-4/12 xl:px-5 xl:py-6">
              <News />
            </div>
          </div>
          <div className="market-container bg-[#050D14] mt-3 p-3 border rounded-2xl border-[#1B232B]">
            <MarketData />
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
