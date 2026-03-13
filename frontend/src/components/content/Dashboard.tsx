import HeaderSettings from "../Header-settings";

export function Dashboard() {
  return (
    <>
      <section className="dashboard-container p-3 w-full">
        <div className="dashboard-header h-16 flex justify-between w-full">
          <div>Dashboard Header</div>
          <HeaderSettings />
        </div>
        <div className="dashboard-content bg-black">Dashboard Content</div>
      </section>
    </>
  );
}

export default Dashboard;
