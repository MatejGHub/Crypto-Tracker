import { createContext, useEffect, useState } from "react";

// Context for wishlist items
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const wishlisted = localStorage.getItem("wishlisted");
      const parsed = JSON.parse(wishlisted ?? "[]");
      if (Array.isArray(parsed)) {
        setIsWishlisted(new Set(parsed));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const [isWishlisted, setIsWishlisted] = useState<Set<string>>(new Set());
  return <WishlistContext.Provider value={{ isWishlisted, setIsWishlisted }}>{children}</WishlistContext.Provider>;
}

const WishlistContext = createContext<
  { isWishlisted: Set<string>; setIsWishlisted: React.Dispatch<React.SetStateAction<Set<string>>> } | undefined
>(undefined);

export default WishlistContext;
