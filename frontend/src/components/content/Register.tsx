import { useEffect, useState, type FormEvent } from "react";

export default function Register() {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("auth") !== null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"register" | "login">("register");
  const [authMessage, setAuthMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const openRegisterModal = () => {
    setIsModalOpen(true);
    setModalType("register");
    setAuthMessage(null);
  };
  const openLoginModal = () => {
    setIsModalOpen(true);
    setModalType("login");
    setAuthMessage(null);
  };
  const closeModal = () => setIsModalOpen(false);
  const [userData, setUserData] = useState({
    usersName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const syncAuthState = () => {
      setIsLoggedIn(sessionStorage.getItem("auth") !== null);
    };

    window.addEventListener("app-auth-change", syncAuthState);
    return () => window.removeEventListener("app-auth-change", syncAuthState);
  }, []);

  const handleRegister = async (): Promise<boolean> => {
    const url = "/api/register";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: userData.usersName,
          email: userData.email,
          password: userData.password,
        }),
      });
      if (response.ok) {
        setAuthMessage({ type: "success", text: "Registration successful. You can now log in." });
        return true;
      }
      setAuthMessage({ type: "error", text: "Registration failed. Please check your inputs." });
      return false;
    } catch {
      setAuthMessage({ type: "error", text: "Network error. Please try again." });
      return false;
    }
  };

  const handleLogin = async (): Promise<boolean> => {
    const url = "/api/login";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthMessage({ type: "error", text: "Login failed. Invalid email or password." });
        setIsLoggedIn(false);
        return false;
      }

      sessionStorage.setItem(
        "auth",
        JSON.stringify({
          token: data.token,
          user: data.user,
          user_id: data.user_id,
        }),
      );
      setIsLoggedIn(true);
      window.dispatchEvent(new Event("app-auth-change"));
      setAuthMessage(null);
      return true;
    } catch {
      setAuthMessage({ type: "error", text: "Network error. Please try again." });
      setIsLoggedIn(false);
      return false;
    }
  };

  const handleModalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok = modalType === "register" ? await handleRegister() : await handleLogin();
    if (ok && modalType === "login") {
      closeModal();
    }
  };

  const userName = JSON.parse(sessionStorage.getItem("auth") ?? "{}")?.user ?? "User";

  return (
    <>
      {isLoggedIn ? (
        <div className="flex w-full items-center justify-between gap-2 overflow-hidden rounded-md border border-[#1B232B] bg-[#090E11] p-2">
          <p className="min-w-0 truncate text-sm text-[#8C98A5]">
            Logged in as <span className="font-semibold text-white">{userName}</span>
          </p>
          <button
            onClick={() => {
              sessionStorage.removeItem("auth");
              setIsLoggedIn(false);
              window.dispatchEvent(new Event("app-auth-change"));
            }}
            className="logout-button shrink-0 rounded-md border border-[#1B232B] bg-[#11161B] px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1A2129]"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-2 flex-row">
          <button onClick={openRegisterModal} className="register-button bg-[#090E11] border border-[#1B232B] rounded-md p-2">
            Register
          </button>
          <button onClick={openLoginModal} className="login-button bg-[#090E11] border border-[#1B232B] rounded-md p-2">
            Login
          </button>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[320px] rounded-lg border border-[#1B232B] bg-[#090E11] p-4 text-white">
            <h2 className="mb-2 text-lg font-semibold">{modalType === "register" ? "Register" : "Login"}</h2>
            <form onSubmit={handleModalSubmit}>
              {authMessage ? (
                <p className={`mb-2 text-sm ${authMessage.type === "error" ? "text-[#FF3B5C]" : "text-[#00B65C]"}`}>
                  {authMessage.text}
                </p>
              ) : null}
              {modalType === "register" && (
                <input
                  type="text"
                  placeholder="Name"
                  className="mb-2 w-full rounded-md border border-[#1B232B] bg-[#0D1318] px-3 py-2 text-sm text-white placeholder:text-[#7B8794] outline-none focus:border-primary"
                  value={userData.usersName}
                  onChange={(e) => setUserData({ ...userData, usersName: e.target.value })}
                />
              )}

              <input
                type="email"
                placeholder="Email"
                className="mb-2 w-full rounded-md border border-[#1B232B] bg-[#0D1318] px-3 py-2 text-sm text-white placeholder:text-[#7B8794] outline-none focus:border-primary"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-md border border-[#1B232B] bg-[#0D1318] px-3 py-2 text-sm text-white placeholder:text-[#7B8794] outline-none focus:border-primary"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-3 py-1 font-medium text-black transition-opacity hover:opacity-90"
                >
                  {modalType === "register" ? "Register" : "Login"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-[#1B232B] bg-[#11161B] px-3 py-1 font-medium text-white transition-colors hover:bg-[#1A2129]"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
