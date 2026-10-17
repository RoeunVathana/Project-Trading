import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useParams, useSearchParams } from "react-router-dom";

import Layout from "./frontend/components/Layout";

const HomePage = lazy(() => import("./frontend/HomePage/HomePage"));
const ProductPage = lazy(() => import("./frontend/ProductPage/ProductPage"));
const DistributionPage = lazy(() => import("./frontend/DistributionPage/DistributionPage"));
const NewPreference = lazy(() => import("./frontend/NewProjectRreference/NewPreference"));
const AboutPage = lazy(() => import("./frontend/AboutPage/AboutPage"));
const ContactPage = lazy(() => import("./frontend/ContactPage/ContactPage"));
const CompliancePage = lazy(() => import("./frontend/CompliancePage/CompliancePage"));
const GetStartedPage = lazy(() => import("./frontend/GetStartedPage/GetStartedPage"));
const CapabilitiesPage = lazy(() => import("./frontend/CapabilitiesPage/CapabilitiesPage"));
const ResourcesPage = lazy(() => import("./frontend/ResourcesPage/ResourcesPage"));
const ProductDetail = lazy(() => import("./frontend/ProductPage/ProductDetail"));
const ProductHuawei = lazy(() => import("./frontend/ProductHuawei/ProductHuawei"));
const ProductHuaweiDetail = lazy(() => import("./frontend/ProductHuawei/ProductHuaweiDetail"));
const SmartModuleController = lazy(() => import("./frontend/ProductHuawei/SmartModule/SmartModuleController"));
const SmartEnergyController = lazy(() => import("./frontend/ProductHuawei/SmartEnergy/SmartEnergyController"));
const SmartStringESS = lazy(() => import("./frontend/ProductHuawei/SmartStringESS/SmartStringESS"));
const SmartGuard = lazy(() => import("./frontend/ProductHuawei/SmartGuard/SmartGuard"));
const Residentail = lazy(() => import("./frontend/ProductHuawei/Residentail/Residentail"));
const HuaweiShowcase = lazy(() => import("./frontend/ProductHuawei/HuaweiShowcase/HuaweiShowcase"));
import DashboardLayout from "./dashboard/components/Layout";
const DashboardPage = lazy(() => import("./dashboard/DashboardPage"));

const RouteLoading = () => (
  <main className="route-loading" aria-live="polite">
    <span className="route-loading-spinner" aria-hidden="true" />
    <p>Loading page...</p>
  </main>
);

const ProductRoute = () => {
  const [searchParams] = useSearchParams();
  return searchParams.get("collection") === "huawei"
    ? <Navigate to="/product-huawei" replace />
    : <ProductPage />;
};

const HuaweiProductRoute = () => {
  const { id } = useParams();

  if (id === "smart-string-ess") return <SmartStringESS />;
  if (id === "smart-energy-controller") return <SmartEnergyController />;
  if (id === "smart-module-controller") return <SmartModuleController />;
  if (id === "smart-guard") return <SmartGuard />;
  if (id && !/^\d+$/.test(id)) return <HuaweiShowcase categorySlug={id} />;

  return <ProductHuawei />;
};

const App = () => {
  return (
    <Suspense fallback={<RouteLoading />}>
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
          <Route path="/product-huawei/:id/learn-more-smart-guard" element={<SmartGuard />} />
          <Route path="/product-huawei/:id/learn-more" element={<SmartModuleController />} />
          <Route path="/product-huawei/:id/learn-more-energy" element={<SmartEnergyController />} />
          <Route path="/product-huawei/:id/learn-more-string-ess" element={<SmartStringESS />} />
          <Route path="/product-huawei/residential-solution" element={<Residentail />} />
          <Route path="/product-huawei/:id" element={<HuaweiProductRoute />} />

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
    </Suspense>
  );
};

export default App;
