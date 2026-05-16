import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Package,
  Bell,
  Info,
  Menu,
  X,
  Store,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import { useAuth } from '../../hooks/useAuth';
import { useVendorAuthContext } from '../../hooks/useVendorAuthContext';
import { notificationAPI } from '../../services/api';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [isAuthenticated, user, isVendorAuthenticated, vendor]);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const customerLinks = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Shops", icon: Store, href: "/shops" },
    { name: "Products", icon: ShoppingBag, href: "/products" },
    { name: "Orders", icon: Package, href: "/orders" },
    { name: "Notifications", icon: Bell, href: "/notifications" },
    { name: "About", icon: Info, href: "/about" },
  ];

  const vendorLinks = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Products", icon: ShoppingBag, href: "/vendor/products" },
   { name: "Dashboard", icon: LayoutDashboard, href: "/vendor-dashboard" },    
   { name: "Notifications", icon: Bell, href: "/notifications" },
    { name: "About", icon: Info, href: "/about" },
  ];

  const navLinks = isVendorAuthenticated ? vendorLinks : customerLinks;

  return (
    <>
      <nav className="hidden  lg:flex  items-center gap-4 ">
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <Link
              key={link.name}
              to={link.href}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg group transition-all duration-300 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50"
            >
              <div className="relative">
                <IconComponent className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-110" />
                {link.name === 'Notifications' && unreadCount > 0 && (
                  <span className="absolute -top-3 -right-3 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 py-0.5 text-[10px] font-semibold leading-none text-white shadow-md ring-2 ring-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors duration-300 tracking-wide">
                {link.name}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={toggleMobileMenu}
        className="lg:hidden relative text-slate-700 hover:text-blue-600 transition-all duration-300 p-2 hover:bg-blue-50 rounded-lg active:scale-95"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={toggleMobileMenu}
          />

          <div className="lg:hidden fixed top-0 left-0 w-80 h-full bg-linear-to-b from-white to-slate-50 shadow-2xl z-50 transform transition-transform duration-300 ease-out animate-slideInLeft">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 tracking-wide">
                Menu
              </h2>
              <button
                onClick={toggleMobileMenu}
                className="text-slate-500 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col p-4 space-y-2 mt-4">
              {navLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group border border-transparent hover:border-blue-100 hover:shadow-md active:scale-98"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-all duration-300 relative">
                      <IconComponent className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-all duration-300" />
                      {link.name === 'Notifications' && unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">{unreadCount}</span>
                      )}
                    </div>
                    <span className="text-base font-semibold text-slate-700 group-hover:text-blue-600 transition-colors duration-300">
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
