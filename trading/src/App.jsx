import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";

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
import ProductHuawei from "./frontend/ProductHuawei/ProductHuawei";
import ProductHuaweiDetail from "./frontend/ProductHuawei/ProductHuaweiDetail";
import SmartModuleController from "./frontend/ProductHuawei/SmartModule/SmartModuleController";
import SmartEnergyController from "./frontend/ProductHuawei/SmartEnergy/SmartEnergyController";
import SmartStringESS from "./frontend/ProductHuawei/SmartStringESS/SmartStringESS";
import DashboardLayout from "./dashboard/components/Layout";
import DashboardPage from "./dashboard/DashboardPage";

const ProductRoute = () => {
  const [searchParams] = useSearchParams();
  return searchParams.get("collection") === "huawei"
    ? <Navigate to="/product-huawei" replace />
    : <ProductPage />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/product" element={<ProductRoute />} />
        <Route
          path="/product/:id"
          element={<ProductDetail />}
        />
        <Route path="/product-huawei" element={<ProductHuawei />} />
        <Route path="/product-huawei/:id/downloads" element={<ProductHuaweiDetail />} />
        <Route path="/product-huawei/:id/learn-more" element={<SmartModuleController />} />
        <Route path="/product-huawei/:id/learn-more-energy" element={<SmartEnergyController />} />
        <Route path="/product-huawei/:id/learn-more-string-ess" element={<SmartStringESS />} />
        <Route path="/product-huawei/:id" element={<ProductHuawei />} />

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
