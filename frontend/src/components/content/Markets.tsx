import HeaderSettings from "../Header-settings";

export function Markets() {
  return (
    <>
      <section className="markets-container w-full text-white h-screen flex flex-col">
        <div className="markets-header h-16 flex justify-between w-full p-3 bg-[#090E11] border-b border-[#1B232B]">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Markets</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="markets-content bg-black p-3 flex-1 border-b border-[#1B232B]">Markets Content</div>
      </section>
    </>
  );
}

export default Markets;
