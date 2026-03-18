import { createContext, useState } from "react";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [isWishlisted, setIsWishlisted] = useState<Set<string>>(new Set());
  return <WishlistContext.Provider value={{ isWishlisted, setIsWishlisted }}>{children}</WishlistContext.Provider>;
}

const WishlistContext = createContext<
  { isWishlisted: Set<string>; setIsWishlisted: React.Dispatch<React.SetStateAction<Set<string>>> } | undefined
>(undefined);

export default WishlistContext;
