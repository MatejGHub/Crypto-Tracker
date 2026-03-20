import { createContext, useState, useEffect } from "react";

type MarketCoin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap_rank: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: { price?: number[] };
};

type MarketDataContextValue = {
  marketData: MarketCoin[];
  setMarketData: React.Dispatch<React.SetStateAction<MarketCoin[]>>;
};

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [marketData, setMarketData] = useState<MarketCoin[]>([]);

  async function getMarketData() {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h,7d";
    try {
      const response = await fetch(url);
      const data = await response.json();

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

  return <MarketDataContext.Provider value={{ marketData, setMarketData }}>{children}</MarketDataContext.Provider>;
}

const MarketDataContext = createContext<MarketDataContextValue | undefined>(undefined);

export default MarketDataContext;
