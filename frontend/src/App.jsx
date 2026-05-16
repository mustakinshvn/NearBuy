import { Navigate, Routes, Route } from "react-router-dom";
import ShopsPage from "./pages/ShopsPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import OrdersPage from "./pages/OrdersPage";
import NotificationsPage from "./pages/NotificationsPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./component/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AdminVendorLoginPage from "./pages/AdminVendorLoginPage";
import VendorDashBoard from "./vendorPages/VendorDashBoard";
import ProtectedVendorsRoutes from "./component/ProtectedVendorsRoutes";
import VendorAddProducts from "./vendorPages/VendorAddProducts";
import { useAuth } from "./hooks/useAuth";
import { useVendorAuthContext } from "./hooks/useVendorAuthContext";

const ProtectedProfileRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { isVendorAuthenticated } = useVendorAuthContext();

  if (!isAuthenticated && !isVendorAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shops" element={<ShopsPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:productId" element={<ProductDetailsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/admin-vendor-login" element={<AdminVendorLoginPage />} />

      <Route
        path="/vendor-dashboard"
        element={
          <ProtectedVendorsRoutes>
            <VendorDashBoard />
          </ProtectedVendorsRoutes>
        }
      />

      <Route
        path="/vendor/add-products"
        element={
          <ProtectedVendorsRoutes>
            <VendorAddProducts />
          </ProtectedVendorsRoutes>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedProfileRoute>
            <ProfilePage />
          </ProtectedProfileRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
