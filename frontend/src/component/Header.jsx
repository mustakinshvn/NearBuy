import Logo from "./sharingComponents/logo";
import Cart from "./headerComponents/Cart";
import ProfileLogo from "./headerComponents/ProfileLogo";
import Navbar from "./headerComponents/NavBar";
import SearchBar from "./headerComponents/SearchBar";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useVendorAuthContext } from "../hooks/useVendorAuthContext";
import { notificationAPI } from "../services/api";
import { useEffect, useState } from "react";
import { ROUTES } from "../lib/ROUTES";
const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const { vendor, isVendorAuthenticated } = useVendorAuthContext();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchCount = async () => {
      try {
        if (isAuthenticated && user) {
          const res = await notificationAPI.getUnreadCountByCustomer(user.customer_id || user.id);
          if (active) setUnreadCount(res.unread_count || 0);
        } else if (isVendorAuthenticated && vendor) {
          const res = await notificationAPI.getUnreadCountByVendor(vendor.vendor_id || vendor.id);
          if (active) setUnreadCount(res.unread_count || 0);
        } else {
          if (active) setUnreadCount(0);
        }
      } catch (err) {
        console.error('Failed to fetch unread count', err);
      }
    };

    fetchCount();
    const t = setInterval(fetchCount, 30000);
    window.addEventListener('notifications:updated', fetchCount);
    return () => {
      active = false;
      clearInterval(t);
      window.removeEventListener('notifications:updated', fetchCount);
    };
  }, [isAuthenticated, user, isVendorAuthenticated, vendor]);

  return (
    <>
      <div className="py-2 mt-2 w-full shadow-lg p-4 sticky top-0 z-50 bg-white rounded-md ">
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-full items-center lg:justify-between gap-3">
            <div className="order-0 lg:order-1">
              <Navbar />
            </div>
            <div className="order-1 lg:order-0  ">
              <Logo />
            </div>
          </div>

          <div className="flex items-center space-x-6 text-3xl font-extrabold">
            <div className="hidden w-full lg:flex  justify-center px-8">
              <SearchBar />
            </div>

            <div className="flex gap-3 lg:gap-5 items-center">
              <Link
                to={ROUTES.NOTIFICATIONS}
                className="lg:hidden relative inline-flex h-10 w-10 items-center justify-center text-slate-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 rounded-lg active:scale-95"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow-md">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              <Cart />
              <ProfileLogo />
            </div>
          </div>
        </div>

        <div className="lg:hidden w-full mt-4">
          <SearchBar />
        </div>
      </div>
    </>
  );
};

export default Header;
