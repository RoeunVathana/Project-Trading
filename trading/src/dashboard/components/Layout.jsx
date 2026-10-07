import { Outlet } from "react-router-dom";
import ScrollReveal from "../../frontend/components/ScrollReveal/ScrollReveal";

const DashboardLayout = () => (
  <div className="dashboard-route">
    <ScrollReveal>
      <Outlet />
    </ScrollReveal>
  </div>
);

export default DashboardLayout;
