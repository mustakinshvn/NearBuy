import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Header from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { Toaster } from "react-hot-toast";
import { VendorAuthProvider } from "./context/VendorAuthContext.jsx";
import { VendorOrderProvider } from "./context/VendorOrderContext.jsx";
import ScrollToTop from "./component/ScrollToTop.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";

export const AppFrame = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="top-center" />
      {!isAdminRoute && <Header />}
      <App />
      {!isAdminRoute && <Footer />}
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop>
        <ToastProvider>
          <AuthProvider>
            <VendorAuthProvider>
              <AdminAuthProvider>
                <VendorOrderProvider>
                  <CartProvider>
                    <AppFrame />
                  </CartProvider>
                </VendorOrderProvider>
              </AdminAuthProvider>
            </VendorAuthProvider>
          </AuthProvider>
        </ToastProvider>
      </ScrollToTop>
    </BrowserRouter>
  </StrictMode>,
);
