import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { getCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  let cartCount = 0;

  if(getCartCount) {
    cartCount = getCartCount()
  }

  const handleCartClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
    } else {
      navigate('/cart');
    }
  };

  return (
    <button 
      onClick={handleCartClick}
      className='relative text-yellow-400 font-extrabold cursor-pointer hover:text-yellow-600 transition-colors'
    >
      <ShoppingCart size={24} />
      {cartCount > 0 && (
        <span className='absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse'>
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  );
};

export default Cart;