import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./frontend/components/Layout";

import HomePage from "./frontend/HomePage/HomePage";
import ProductPage from "./frontend/ProductPage/ProductPage";
import DistributionPage from "./frontend/DistributionPage/DistributionPage";
import NewPreference from "./frontend/NewProjectRreference/NewPreference";
import AboutPage from "./frontend/AboutPage/AboutPage";
import ContactPage from "./frontend/ContactPage/ContactPage";
import CompliancePage from "./frontend/CompliancePage/CompliancePage";
import GetStartedPage from "./frontend/GetStartedPage/GetStartedPage";
import CapabilitiesPage from "./frontend/CapabilitiesPage/CapabilitiesPage";
import ResourcesPage from "./frontend/ResourcesPage/ResourcesPage";
import ProductDetail from "./frontend/ProductPage/ProductDetail";
import DashboardLayout from "./dashboard/components/Layout";
import DashboardPage from "./dashboard/DashboardPage";
const App = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/product" element={<ProductPage />} />
        <Route
          path="/product/:id"
          element={<ProductDetail />}
        />

        <Route path="/distribution" element={<DistributionPage />} />

        <Route path="/reference" element={<NewPreference />} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="/contact" element={<ContactPage />} />

        <Route path="/compliance" element={<CompliancePage />} />

        <Route path="/get-started" element={<GetStartedPage />} />

        <Route path="/capabilities/5" element={<CapabilitiesPage />} />

        <Route path="/resources" element={<ResourcesPage />} />
      </Route>

      {/* Keep Home as the default destination for unknown public URLs. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
