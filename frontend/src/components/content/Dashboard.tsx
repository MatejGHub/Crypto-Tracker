import HeaderSettings from "../Header-settings";
import Chart from "../Chart";
import News from "../News";
import MarketData from "../MarketData";
import Cards from "./Cards";

export function Dashboard() {
  return (
    <>
      <section className="dashboard-container w-full text-white h-screen flex flex-col">
        <div className="dashboard-header h-16 flex justify-between w-full p-3 bg-[#090E11] border-b border-[#1B232B]">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Dashboard</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="dashboard-content min-h-0 flex-1 overflow-y-auto border-b border-[#1B232B] bg-black p-3">
          <Cards />
          <div className="dashboard-content-chart mt-3 flex w-full items-start gap-3">
            <div className="rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6 w-8/12 sticky top-0">
              <Chart />
            </div>
            <div className="rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6 w-4/12 sticky top-0">
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
