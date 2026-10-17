import { Outlet, useLocation } from "react-router-dom";
import ScrollReveal from "../../frontend/components/ScrollReveal/ScrollReveal";

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="dashboard-route">
      <div className="page-transition" key={`${location.pathname}${location.search}`}>
        <ScrollReveal>
          <Outlet />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default DashboardLayout;
