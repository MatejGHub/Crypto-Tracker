import HeaderSettings from "../Header-settings";

export function Watchlist() {
  return (
    <>
      <section className="watchlist-container w-full text-white h-screen flex flex-col">
        <div className="watchlist-header h-16 flex justify-between w-full p-3 bg-[#090E11] border-b border-[#1B232B]">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Watchlist</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="watchlist-content bg-black p-3 flex-1 border-b border-[#1B232B]">Watchlist Content</div>
      </section>
    </>
  );
}

export default Watchlist;
