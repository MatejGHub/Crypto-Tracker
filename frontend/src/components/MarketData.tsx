import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export function MarketData() {
  const [marketData, setMarketData] = useState<any[]>([]);
  async function getMarketData() {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h,7d";
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const loadMarketData = async () => {
      const data = await getMarketData();
      setMarketData(data ?? []);
    };

    loadMarketData();

    const id = setInterval(loadMarketData, 1000 * 60 * 60 * 24);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="flex flex-row gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071B14]">
          <Sparkles className="h-5 w-5 text-[#00B65C]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">Market Data</h2>
          <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
        </div>
      </div>
      <div className="table-container">
        <table className="w-full mt-3">
          <thead>
            <tr>
              <td>#</td>
              <td>Name</td>
              <td>Price</td>
              <td>24h Change</td>
              <td>Market Cap</td>
              <td>Volume</td>
              <td>Supply</td>
              <td>Wishlist</td>
            </tr>
          </thead>
          <tbody>
            {marketData.map((singleMarketData) => {
              return (
                <tr key={singleMarketData.id}>
                  <td>{singleMarketData.market_cap_rank}</td>
                  <td>{singleMarketData.name}</td>
                  <td>{singleMarketData.current_price}</td>
                  <td>{singleMarketData.price_change_percentage_24h}</td>
                  <td>{singleMarketData.market_cap}</td>
                  <td>{singleMarketData.total_volume}</td>
                  <td>{singleMarketData.circulating_supply}</td>
                  <td>Wishlist</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MarketData;
