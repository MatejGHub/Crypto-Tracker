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
      <section className="settings-container flex h-full w-full min-h-0 flex-col overflow-y-auto bg-black text-white">
        <div className="settings-header flex h-16 w-full items-center justify-between border-b border-[#1B232B] bg-[#090E11] px-3">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Settings</h1>
            <p className="text-sm text-gray-100">Track your favorite cryptocurrencies</p>
          </div>
          <HeaderSettings />
        </div>
        <div className="settings-content min-h-0 flex-1 border-b border-[#1B232B] bg-black p-3">
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
              <div className="mt-6 border-t border-[#1B232B] pt-3 text-xs text-[#617181]">
                <a href="#privacy-policy" className="transition-colors hover:text-[#8C98A5]">
                  Privacy policy
                </a>
              </div>
            </article>
          </div>
          <article
            id="privacy-policy"
            className="mt-3 rounded-2xl border border-[#1B232B] bg-[#050D14] p-4 text-sm text-[#8C98A5]"
          >
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-[#8C98A5] [&::-webkit-details-marker]:hidden">
                <span>Privacy policy</span>
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 8L10 13L15 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <div className="mt-3 space-y-3 leading-relaxed">
                <p>
                  This app may process basic usage and technical data to run features and improve reliability, including page
                  visits, device/browser details, and app interaction events.
                </p>
                <p>
                  If analytics are enabled, Microsoft Clarity may collect session recordings and heatmap data. This helps identify
                  bugs and improve user experience.
                </p>
                <p>
                  Account data entered in this app (such as email and watchlist items) is stored to support login and saved
                  features. Sensitive credentials are not intentionally stored in browser logs.
                </p>
                <p>
                  Third-party market and AI providers may receive request metadata needed to return results. Their services are
                  governed by their own privacy terms.
                </p>
                <p>You can clear local app data at any time from Settings using Clear Session and Clear Wishlist Cache.</p>
                <p>Contact: matej.stremfelj26@gmail.com</p>
                <p className="text-xs text-[#617181]">Last updated: April 2026</p>
              </div>
            </details>
          </article>
        </div>
      </section>
    </>
  );
}

export default Settings;
