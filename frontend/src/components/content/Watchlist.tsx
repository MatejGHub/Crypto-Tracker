import HeaderSettings from "../Header-settings";

export function Watchlist() {
  return (
    <>
      <section className="watchlist-container p-3 w-full">
        <div className="watchlist-header h-16 flex justify-between w-full">
          <div>Watchlist Header</div>
          <HeaderSettings />
        </div>
        <div className="watchlist-content bg-black">Watchlist Content</div>
      </section>
    </>
  );
}

export default Watchlist;
