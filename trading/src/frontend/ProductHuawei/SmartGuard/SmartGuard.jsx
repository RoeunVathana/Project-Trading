import { useLocation } from "react-router-dom";
import HuaweiShowcase from "../HuaweiShowcase/HuaweiShowcase";

const SmartGuard = () => {
  const location = useLocation();

  return (
    <HuaweiShowcase
      categorySlug="smart-guard"
      productOverride={location.state?.product || null}
    />
  );
};

export default SmartGuard;
