import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import HeaderSettings from "../Header-settings";

export function Settings() {
  const navigate = useNavigate();
  const auth = useMemo(() => JSON.parse(sessionStorage.getItem("auth") ?? "{}"), []);
  const isLoggedIn = Boolean(auth?.token);
  const userName = auth?.user ?? "Guest";
  const userId = auth?.user_id ?? "—";
  const currentTheme = document.documentElement.getAttribute("data-theme") ?? "dark";

  const resetThemePreference = () => {
    const key = isLoggedIn ? `theme:user:${String(userId)}` : "theme:guest";
    localStorage.removeItem(key);
    const root = document.documentElement;
    root.classList.add("theme-switching");
    root.setAttribute("data-theme", "dark");
    window.dispatchEvent(new CustomEvent("app-theme-change", { detail: { theme: "dark" } }));
    window.setTimeout(() => root.classList.remove("theme-switching"), 0);
    alert("Theme preference reset to dark.");
  };

  const clearWishlistCache = () => {
    localStorage.removeItem("wishlisted");
    alert("Local wishlist cache cleared.");
  };

  const logout = () => {
    sessionStorage.removeItem("auth");
    window.dispatchEvent(new Event("app-auth-change"));
    navigate("/");
  };

  return (
    <>
      <section className="settings-container w-full text-white h-screen flex flex-col">
        <div className="settings-header h-16 flex justify-between w-full p-3 bg-[#090E11] border-b border-[#1B232B]">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Settings</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="settings-content bg-black p-3 flex-1 border-b border-[#1B232B] overflow-y-auto">
          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-[#1B232B] bg-[#050D14] p-4">
              <h2 className="text-base font-semibold text-white">Account</h2>
              <p className="mt-2 text-sm text-[#8C98A5]">Status: {isLoggedIn ? "Logged in" : "Logged out"}</p>
              <p className="text-sm text-[#8C98A5]">User: {userName}</p>
              <p className="text-sm text-[#8C98A5]">User ID: {String(userId)}</p>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md border border-[#1B232B] bg-[#11161B] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1A2129]"
                >
                  Clear Session (Logout)
                </button>
              </div>
            </article>

            <article className="rounded-2xl border border-[#1B232B] bg-[#050D14] p-4">
              <h2 className="text-base font-semibold text-white">Preferences</h2>
              <p className="mt-2 text-sm text-[#8C98A5]">Current theme: {currentTheme}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={resetThemePreference}
                  className="rounded-md border border-[#1B232B] bg-[#11161B] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1A2129]"
                >
                  Reset Theme Preference
                </button>
                <button
                  type="button"
                  onClick={clearWishlistCache}
                  className="rounded-md border border-[#1B232B] bg-[#11161B] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1A2129]"
                >
                  Clear Wishlist Cache
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

export default Settings;
