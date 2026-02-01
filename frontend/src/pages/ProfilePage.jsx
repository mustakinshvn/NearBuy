import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useOrders } from "../hooks/useOrders";
import ProfileHeader from "../component/profile/ProfileHeader";
import AlertMessages from "../component/profile/AlertMessages";
import ProfileCard from "../component/profile/ProfileCard";
import TabNavigation from "../component/profile/TabNavigation";
import StatsCards from "../component/profile/StatsCards";
import ProfileInformationCard from "../component/profile/ProfileInformationCard";
import SettingsPreferences from "../component/profile/SettingsPreferences";
import SecuritySettings from "../component/profile/SecuritySettings";
import { useVendorAuthContext } from "../hooks/useVendorAuthContext";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { vendor } = useVendorAuthContext();
  const { orders } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    full_name: user?.full_name || vendor?.full_name || "",
    email: user?.email || vendor?.email || "",
    phone_number: user?.phone_number || vendor?.phone_number || "",
    address: user?.address || vendor?.address || "",
    city: user?.city || vendor?.city || "",
    postal_code: user?.postal_code || vendor?.postal_code || "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const totalOrders = orders?.length || 0;
  const totalSpent =
    orders?.reduce(
      (sum, order) => sum + (parseFloat(order.final_amount) || 0),
      0,
    ) || 0;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader />

        <AlertMessages
          error={error}
          setError={setError}
          success={success}
          setSuccess={setSuccess}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProfileCard
              user={user}
              vendor={vendor}
              getInitials={getInitials}
            />
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <StatsCards totalOrders={totalOrders} totalSpent={totalSpent} />
                <ProfileInformationCard
                  user={user}
                  vendor={vendor}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  formData={formData}
                  setFormData={setFormData}
                  setSuccess={setSuccess}
                />
              </div>
            )}

            {activeTab === "settings" && <SettingsPreferences />}

            {activeTab === "security" && (
              <SecuritySettings handleLogout={handleLogout} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
