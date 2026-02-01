import { Navigate, useLocation } from "react-router-dom";
import { useVendorAuthContext } from "../hooks/useVendorAuthContext";

const ProtectedVendorsRoutes = ({ children }) => {
  const { isVendorAuthenticated } = useVendorAuthContext();
  const location = useLocation();

  if (!isVendorAuthenticated) {
    return (
      <Navigate to="/admin-vendor-login" state={{ from: location }} replace />
    );
  }

  return children;
};

export default ProtectedVendorsRoutes;
