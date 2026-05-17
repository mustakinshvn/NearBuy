import { Navigate, Routes, Route } from "react-router-dom";
import ShopsPage from "./pages/ShopsPage";
import ShopDetailsPage from "./pages/ShopDetailsPage";
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
import VendorProductsPage from "./vendorPages/VendorProductsPage";
import { useAuth } from "./hooks/useAuth";
import { useVendorAuthContext } from "./hooks/useVendorAuthContext";
import ProtectedAdminRoute from "./component/ProtectedAdminRoute";
import AdminLayout from "./component/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminEntityPage from "./pages/admin/AdminEntityPage";
import AdminConfigurationPage from "./pages/admin/AdminConfigurationPage";
import { adminAPI } from "./services/api";
import { ROUTES } from "./lib/ROUTES";

const ProtectedProfileRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { isVendorAuthenticated } = useVendorAuthContext();

  if (!isAuthenticated && !isVendorAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.SHOPS} element={<ShopsPage />} />
      <Route path={ROUTES.SHOP_DETAILS} element={<ShopDetailsPage />} />
      <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
      <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetailsPage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              itemsKey="products"
      <Route path={ROUTES.ADMIN_VENDOR_LOGIN} element={<AdminVendorLoginPage />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />

      <Route
        path={ROUTES.ADMIN}
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route
          path={ROUTES.ADMIN_ROUTES.VENDORS}
          element={
            <AdminEntityPage
              title="Vendors"
              description="Review vendor accounts and remove inactive or abusive shops."
              loadItems={adminAPI.getVendors}
              deleteItem={adminAPI.deleteVendor}
              idKey="vendor_id"
              columns={[
                { key: 'vendor_id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'shop_name', label: 'Shop' },
                { key: 'shop_type', label: 'Type' },
                { key: 'city', label: 'City' },
              ]}
            />
          }
        />
        <Route
          path={ROUTES.ADMIN_ROUTES.CUSTOMERS}
          element={
            <AdminEntityPage
              title="Customers"
              description="Keep customer accounts organized and remove records when necessary."
              loadItems={adminAPI.getCustomers}
              deleteItem={adminAPI.deleteCustomer}
              idKey="customer_id"
              columns={[
                { key: 'customer_id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'created_at', label: 'Joined', render: (item) => new Date(item.created_at).toLocaleString() },
              ]}
            />
          }
        />
        <Route
          path={ROUTES.ADMIN_ROUTES.PRODUCTS}
          element={
            <AdminEntityPage
              title="Products"
              description="Manage product catalog entries and remove stale products from the marketplace."
              loadItems={adminAPI.getProducts}
              deleteItem={adminAPI.deleteProduct}
              idKey="product_id"
              columns={[
                { key: 'product_id', label: 'ID' },
                { key: 'title', label: 'Title' },
                { key: 'brand', label: 'Brand' },
                { key: 'price', label: 'Price' },
                { key: 'stock_quantity', label: 'Stock' },
                { key: 'seller_id', label: 'Seller ID' },
              ]}
            />
          }
        />
        <Route
          path={ROUTES.ADMIN_ROUTES.ORDERS}
          element={
            <AdminEntityPage
              title="Orders"
              description="Audit order activity across the marketplace."
              loadItems={adminAPI.getOrders}
              deleteItem={adminAPI.deleteOrder}
              idKey="order_id"
              columns={[
                { key: 'order_id', label: 'ID' },
                { key: 'customer_id', label: 'Customer' },
                { key: 'vendor_id', label: 'Vendor' },
                { key: 'final_amount', label: 'Final Amount' },
                { key: 'payment_status', label: 'Payment' },
                { key: 'order_status', label: 'Status' },
              ]}
            />
          }
        />
        <Route
          path={ROUTES.ADMIN_ROUTES.NOTIFICATIONS}
          element={
            <AdminEntityPage
              title="Notifications"
              description="Inspect platform notifications and support events."
              loadItems={adminAPI.getNotifications}
              idKey="notification_id"
              columns={[
                { key: 'notification_id', label: 'ID' },
                { key: 'title', label: 'Title' },
                { key: 'type', label: 'Type' },
                { key: 'priority', label: 'Priority' },
                { key: 'sent_at', label: 'Sent', render: (item) => new Date(item.sent_at).toLocaleString() },
              ]}
            />
          }
        />
        <Route path={ROUTES.ADMIN_ROUTES.CONFIGURATION} element={<AdminConfigurationPage />} />
      </Route>

      <Route
        path={ROUTES.VENDOR_DASHBOARD}
        element={
          <ProtectedVendorsRoutes>
            <VendorDashBoard />
          </ProtectedVendorsRoutes>
        }
      />

      <Route
        path={ROUTES.VENDOR_PRODUCTS}
        element={
          <ProtectedVendorsRoutes>
            <VendorProductsPage />
          </ProtectedVendorsRoutes>
        }
      />

      <Route
        path={ROUTES.VENDOR_PRODUCT_EDIT}
        element={
          <ProtectedVendorsRoutes>
            <VendorAddProducts />
          </ProtectedVendorsRoutes>
        }
      />

      <Route
        path={ROUTES.VENDOR_ADD_PRODUCTS}
        element={
          <ProtectedVendorsRoutes>
            <VendorAddProducts />
          </ProtectedVendorsRoutes>
        }
      />

      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedProfileRoute>
            <ProfilePage />
          </ProtectedProfileRoute>
        }
      />
      <Route
        path={ROUTES.CART}
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.CHECKOUT}
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ORDERS}
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.NOTIFICATIONS}
        element={
          <ProtectedProfileRoute>
            <NotificationsPage />
          </ProtectedProfileRoute>
        }
      />
    </Routes>
  );
}

export default App;
