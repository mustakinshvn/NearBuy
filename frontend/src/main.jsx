import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <VendorAuthProvider>
            <VendorOrderProvider>
              <CartProvider>
                <Toaster position="top-center" />
                <Header />
                <App />
                <Footer />
              </CartProvider>
            </VendorOrderProvider>
          </VendorAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
