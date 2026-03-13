import HeaderSettings from "../Header-settings";

export function Settings() {
  return (
    <>
      <section className="settings-container p-3 w-full">
        <div className="settings-header h-16 flex justify-between w-full">
          <div>Settings Header</div>
          <HeaderSettings />
        </div>
        <div className="settings-content bg-black">Settings Content</div>
      </section>
    </>
  );
}

export default Settings;
