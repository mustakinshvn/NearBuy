import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, ShoppingBag, Bell, UserCheck, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import { useVendorAuthContext } from "../../hooks/useVendorAuthContext";
import profileAvatar from "../../assets/profile-avatar.png";

const ProfileLogo = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { vendor, isVendorAuthenticated, vendorLogout } =
    useVendorAuthContext();
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (isAuthenticated) {
      logout();
    } else if (isVendorAuthenticated) {
      vendorLogout();
    }

    setShowDropdown(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    if (!isAuthenticated && !isVendorAuthenticated) {
      navigate("/login");
      return;
    }
    setShowDropdown(!showDropdown);
  };

  const isVendor = isVendorAuthenticated && !isAuthenticated;

  const goToRoute = (route) => {
    navigate(route);
    setShowDropdown(false);
  };

  const profileImageUrl =
    (isAuthenticated
      ? user?.profile_image_url ||
        user?.avatar_url ||
        user?.photo_url ||
        user?.image_url
      : isVendorAuthenticated
        ? vendor?.profile_image_url ||
          vendor?.avatar_url ||
          vendor?.logo_url ||
          vendor?.logo ||
          vendor?.image_url ||
          vendor?.image
        : null) || null;

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={handleProfileClick}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="relative flex items-center justify-center size-8 rounded-full bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl curosor-pointer">
          {isAuthenticated || isVendorAuthenticated ? (
            <img
              src={profileImageUrl || profileAvatar}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <User className="text-white" size={20} />
          )}
        </div>
      </div>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {isAuthenticated
                ? user?.name
                : isVendorAuthenticated
                  ? vendor?.name
                  : "Guest"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {isAuthenticated
                ? user?.email
                : isVendorAuthenticated
                  ? vendor?.email
                  : ""}
            </p>
          </div>

              {isVendor ? (
                <button
                  onClick={() => goToRoute("/vendor-dashboard")}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <UserCheck size={16} />
                  Vendor Dashboard
                </button>
              ) : null}

              {isVendor ? (
                <button
                  onClick={() => goToRoute("/vendor/products")}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  My Products
                </button>
              ) : null}

              {isVendor ? (
                <button
                  onClick={() => goToRoute("/vendor/add-products")}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <PlusCircle size={16} />
                  Add Product
                </button>
              ) : null}

          <button
                onClick={() => goToRoute("/profile")}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <User size={16} />
            My Profile
          </button>

          <button
                onClick={() => goToRoute("/orders")}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ShoppingBag size={16} />
            My Orders
          </button>

          <button
                onClick={() => goToRoute("/notifications")}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Bell size={16} />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full cursor-pointer">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="border-t border-gray-200 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileLogo;
