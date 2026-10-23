const publicAsset = (fileName) => `${import.meta.env.BASE_URL}iconNavbar/${fileName}`;

export const HUAWEI_NAVBAR_PRODUCT_IMAGES = Object.freeze({
  "smart-string-ess": publicAsset("luna2000-7_14_21-s1.png"),
  "smart-energy-controller": publicAsset("sun2000-12_15_17_20_25k-mb0.png"),
  "smart-module-controller": publicAsset("merc-600w-pa0.png"),
  "smart-guard": publicAsset("smartguard-63a-s0-aus0.png"),
  "smart-pv-controller": publicAsset("sun2000-150k-mg0.png"),
  "hybrid-cooling-grid-forming-ess": publicAsset("luna2000-215-series.png"),
  accessories: publicAsset("ci-smartdongle-4g.png"),
});

export const getHuaweiNavbarImage = (productId, solutionId = "") => {
  if (productId === "smart-module-controller"
    && solutionId === "commercial-industrial-solutions") {
    return publicAsset("merc-1100-1300w-p.png");
  }

  return HUAWEI_NAVBAR_PRODUCT_IMAGES[productId] || "";
};
