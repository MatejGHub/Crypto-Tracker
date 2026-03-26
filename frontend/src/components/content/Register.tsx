import { useState } from "react";

export default function Register() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"register" | "login">("register");
  const openRegisterModal = () => {
    setIsModalOpen(true);
    setModalType("register");
  };
  const openLoginModal = () => {
    setIsModalOpen(true);
    setModalType("login");
  };
  const closeModal = () => setIsModalOpen(false);
  const [userData, setUserData] = useState({
    usersName: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    const url = "http://localhost:8000/api/register";
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
    const data = await response.json();
    if (response.ok) {
      setIsLoggedIn(true);
      console.log(data);
    } else {
      console.log(data);
    }
  };

  const handleLogin = async () => {
    const url = "http://localhost:8000/api/login";
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
    setIsLoggedIn(true);
    console.log(data);
  };

  return (
    <>
      {isLoggedIn ? (
        <div>
          <p>You are logged in</p>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="logout-button bg-[#090E11] border border-[#1B232B] rounded-md p-2"
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
                onClick={() => {
                  modalType === "register" ? handleRegister() : handleLogin();
                  closeModal();
                }}
                className="rounded-md bg-primary px-3 py-1 font-medium text-black transition-opacity hover:opacity-90"
              >
                {modalType === "register" ? "Register" : "Login"}
              </button>
              <button
                onClick={closeModal}
                className="rounded-md border border-[#1B232B] bg-[#11161B] px-3 py-1 font-medium text-white transition-colors hover:bg-[#1A2129]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
