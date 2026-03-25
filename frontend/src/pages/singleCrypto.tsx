import HeaderSettings from "../components/Header-settings";
import News from "../components/News";
import MarketData from "../components/MarketData";
import Cards from "../components/content/Cards";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const coinUrl = (id: string) => {
  const q = "localization=false&tickers=false&community_data=false&developer_data=false";
  const p = `/api/v3/coins/${encodeURIComponent(id)}?${q}`;
  return import.meta.env.DEV ? `/coingecko${p}` : `https://api.coingecko.com${p}`;
};

type CoinDetail = {
  name?: string;
  symbol?: string;
  image?: { small?: string };
  market_data?: {
    current_price?: { usd?: number };
    market_cap?: { usd?: number };
    total_volume?: { usd?: number };
    price_change_percentage_24h?: number;
  };
};

export default function SingleCrypto() {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState<CoinDetail | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!coinId) return;
    const ac = new AbortController();
    setLoadError(false);
    setCoinData(null);
    fetch(coinUrl(coinId), { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<CoinDetail>;
      })
      .then(setCoinData)
      .catch((e) => {
        if (e.name !== "AbortError") setLoadError(true);
      });
    return () => ac.abort();
  }, [coinId]);

  const title = coinData?.name ?? (coinId ? coinId : "Crypto");
  const price = coinData?.market_data?.current_price?.usd;
  const pct24 = coinData?.market_data?.price_change_percentage_24h;
  const mcap = coinData?.market_data?.market_cap?.usd;
  const vol = coinData?.market_data?.total_volume?.usd;

  return (
    <>
      <section className="dashboard-container w-full text-white h-screen flex flex-col">
        <div className="dashboard-header h-16 flex justify-between w-full p-3 bg-[#090E11] border-b border-[#1B232B]">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold capitalize">{title}</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="dashboard-content min-h-0 flex-1 overflow-y-auto border-b border-[#1B232B] bg-black p-3">
          {loadError ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 px-4 text-center text-[#7B8794]">
              <p>Could not load this coin.</p>
              <p className="text-sm">Try again later.</p>
            </div>
          ) : !coinData ? (
            <div className="flex min-h-[200px] items-center justify-center text-[#7B8794]">Loading…</div>
          ) : (
            <>
              <Cards />
              <div className="dashboard-content-chart mt-3 flex w-full items-start gap-3">
                <div className="rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6 w-8/12 sticky top-0">
                  <div className="flex flex-wrap items-center gap-4 border-b border-[#1B232B] pb-4">
                    {coinData.image?.small ? <img src={coinData.image.small} alt="" className="h-12 w-12 rounded-full" /> : null}
                    <div>
                      <div className="text-xl font-bold">
                        {coinData.name} <span className="text-[#7B8794]">{coinData.symbol?.toUpperCase()}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-3 text-sm">
                        <span>${price != null ? price.toLocaleString() : "—"}</span>
                        {pct24 != null && (
                          <span className={pct24 >= 0 ? "text-green-400" : "text-red-400"}>
                            {pct24 >= 0 ? "+" : ""}
                            {pct24.toFixed(2)}% (24h)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-[#7B8794]">
                    <div className="flex justify-between border-b border-[#1B232B] py-2">
                      <span>Market cap</span>
                      <span className="text-white">
                        {mcap != null ? `$${mcap.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#1B232B] py-2">
                      <span>24h volume</span>
                      <span className="text-white">
                        {vol != null ? `$${vol.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#1B232B] bg-[#050D14] px-5 py-6 w-4/12 sticky top-0">
                  <News />
                </div>
              </div>
              <div className="market-container bg-[#050D14] mt-3 p-3 border rounded-2xl border-[#1B232B]">
                <MarketData />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
