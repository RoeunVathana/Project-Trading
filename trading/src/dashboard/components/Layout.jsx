import { Outlet } from "react-router-dom";

const DashboardLayout = () => (
  <div className="dashboard-route">
    <Outlet />
  </div>
);

export default DashboardLayout;
