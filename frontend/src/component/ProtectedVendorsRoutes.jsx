import { Navigate, useLocation } from "react-router-dom";
import { useVendorAuth } from "../hooks/useVendorAuthContext";

const ProtectedVendorsRoutes = ({ children }) => {
  const { isAuthenticated } = useVendorAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to="/admin-vendor-login" state={{ from: location }} replace />
    );
  }

  return children;
};

export default ProtectedVendorsRoutes;
