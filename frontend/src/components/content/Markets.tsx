import HeaderSettings from "../Header-settings";

export function Markets() {
  return (
    <>
      <section className="markets-container p-3 w-full">
        <div className="markets-header h-16 flex justify-between w-full">
          <div>Markets Header</div>
          <HeaderSettings />
        </div>
        <div className="markets-content bg-black">Markets Content</div>
      </section>
    </>
  );
}

export default Markets;
