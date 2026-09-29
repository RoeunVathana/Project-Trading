import { Route, Routes } from "react-router-dom";

import Layout from "./frontend/components/Layout";

import HomePage from "./frontend/HomePage/HomePage";
import ProductPage from "./frontend/ProductPage/ProductPage";
import DistributionPage from "./frontend/DistributionPage/DistributionPage";
import ReferencePage from "./frontend/ReferencePage/ReferencePage";
import AboutPage from "./frontend/AboutPage/AboutPage";
import ContactPage from "./frontend/ContactPage/ContactPage";
import CompliancePage from "./frontend/CompliancePage/CompliancePage";
import GetStartedPage from "./frontend/GetStartedPage/GetStartedPage";
import CapabilitiesPage from "./frontend/CapabilitiesPage/CapabilitiesPage";
import ResourcesPage from "./frontend/ResourcesPage/ResourcesPage";
import ProductDetail from "./frontend/ProductPage/ProductDetail";
const App = () => {
  return (
    <Routes>
      {/* Layout */}
      <Route element={<Layout />}>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Product */}
        <Route path="/product" element={<ProductPage />} />
        <Route
            path="/product/:id"
            element={<ProductDetail />}
        />

        {/* Distribution Partner */}
        <Route path="/distribution" element={<DistributionPage />} />

        {/* Project Reference */}
        <Route path="/reference" element={<ReferencePage />} />

        {/* About */}
        <Route path="/about" element={<AboutPage />} />

        {/* Contact */}
        <Route path="/contact" element={<ContactPage />} />

        {/* Compliance */}
        <Route path="/compliance" element={<CompliancePage />} />

        {/* Get Started */}
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/" element={<HomePage />} />

        <Route path="/product" element={<ProductPage />} />

        <Route path="/capabilities/5" element={<CapabilitiesPage />} />

        <Route path="/resources" element={<ResourcesPage />} />
      </Route>
    </Routes>
  );
};

export default App;
