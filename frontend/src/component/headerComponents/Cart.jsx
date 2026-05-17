import { ShoppingCart, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useVendorAuthContext } from "../../hooks/useVendorAuthContext";
import { ROUTES } from "../../lib/ROUTES";

const Cart = () => {
  const { getCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { isVendorAuthenticated } = useVendorAuthContext();
  const navigate = useNavigate();
  let cartCount = 0;

  if (getCartCount) {
    cartCount = getCartCount();
  }

  const handleCartClick = () => {
    if (isVendorAuthenticated) {
      navigate(ROUTES.VENDOR_ADD_PRODUCTS);
      return;
    }

    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: { pathname: ROUTES.CART } } });
    } else {
      navigate(ROUTES.CART);
    }
  };

  return (
    <button
      onClick={handleCartClick}
      className="relative text-yellow-400 font-extrabold cursor-pointer hover:text-yellow-600 transition-colors"
      aria-label={isVendorAuthenticated ? "Add Product" : "Cart"}
    >
      {isVendorAuthenticated ? <PlusCircle size={30} /> : <ShoppingCart size={30} />}
      {!isVendorAuthenticated && cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </button>
  );
};

export default Cart;
