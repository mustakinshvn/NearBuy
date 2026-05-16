import { Edit2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../hooks/useToast";
import Button from "../sharingComponents/Button";

const ProfileInformationCard = ({
  user,
  vendor,
  isEditing,
  setIsEditing,
  formData,
  setFormData,
  setSuccess,
  onUserUpdate,
}) => {
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  const currentProfileImageUrl = useMemo(() => {
    const entity = user || vendor || null;
    if (!entity) return "";
    return (
      entity.profile_image_url ||
      entity.avatar_url ||
      entity.photo_url ||
      entity.logo_url ||
      entity.image_url ||
      ""
    );
  }, [user, vendor]);

  useEffect(() => {
    if (!profileImageFile) {
      setProfilePreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(profileImageFile);
    setProfilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profileImageFile]);

  const apiBaseUrl = useMemo(() => {
    return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  }, []);

  const target = useMemo(() => {
    if (user?.customer_id) {
      return { type: "customer", id: user.customer_id };
    }
    if (vendor?.vendor_id) {
      return { type: "vendor", id: vendor.vendor_id };
    }
    return null;
  }, [user, vendor]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      if (!target) {
        console.error("No user/vendor selected for profile update");
        setSuccess(false);
        showError("Profile information is missing. Please log in again.");
        return;
      }

      // 1) Upload profile photo if selected
      if (profileImageFile) {
        const uploadForm = new FormData();
        uploadForm.append("profileImage", profileImageFile);
        const uploadUrl =
          target.type === "customer"
            ? `${apiBaseUrl}/customers/${target.id}/profile-photo`
            : `${apiBaseUrl}/vendors/${target.id}/profile-photo`;

        const uploadRes = await fetch(uploadUrl, {
          method: "POST",
          body: uploadForm,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(
            uploadData?.message || "Failed to upload profile photo",
          );
        }

        const uploadedUrl =
          uploadData?.profile_image_url ||
          uploadData?.vendor?.profile_image_url ||
          uploadData?.customer?.profile_image_url ||
          null;

        if (uploadedUrl && onUserUpdate) {
          onUserUpdate({ profile_image_url: uploadedUrl });
        }

        setProfileImageFile(null);
      }

      // 2) Save profile info (existing behavior: JSON PUT)
      const updateUrl =
        target.type === "customer"
          ? `${apiBaseUrl}/customers/${target.id}`
          : `${apiBaseUrl}/vendors/${target.id}`;

      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        const updatedEntity =
          updatedData?.customer || updatedData?.vendor || updatedData;
        if (updatedEntity && typeof updatedEntity === "object") {
          setFormData((prev) => ({ ...prev, ...updatedEntity }));
          if (onUserUpdate) {
            onUserUpdate(updatedEntity);
          }
        }
        setSuccess(true);
        showSuccess("Profile updated successfully");
        setIsEditing(false);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        console.error("Failed to update profile");
        setSuccess(false);
        showError("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSuccess(false);
      showError(error.message || "Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-linear-to-b from-slate-700 to-slate-800 rounded-2xl border border-slate-600/50 backdrop-blur overflow-hidden">
      <div className="flex items-center justify-between px-8 py-6 bg-slate-800/50 border-b border-slate-600/50">
        <h3 className="text-xl font-bold text-white">Personal Information</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </button>
        )}
      </div>

      <div className="p-8">
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Name
              </label>
              <p className="text-lg text-white mt-2 font-medium">
                {user?.name || vendor?.name || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <p className="text-lg text-white mt-2 font-medium">
                {user?.email || vendor?.email || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Phone Number
              </label>
              <p className="text-lg text-white mt-2 font-medium">
                {user?.phone || vendor?.phone || "Not provided"}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 bg-slate-500 border border-slate-500 rounded-lg text-slate-300 cursor-not-allowed opacity-60"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProfileImageFile(e.target.files?.[0] || null)
                    }
                    className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  {profilePreviewUrl || currentProfileImageUrl ? (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-16 w-16 overflow-hidden rounded-lg border border-slate-500 bg-slate-700">
                        <img
                          src={profilePreviewUrl || currentProfileImageUrl}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-slate-300">
                          {profilePreviewUrl
                            ? "New photo preview"
                            : "Current photo"}
                        </p>
                        {profilePreviewUrl ? (
                          <button
                            type="button"
                            onClick={() => setProfileImageFile(null)}
                            className="w-fit rounded-md bg-slate-900/60 px-2 py-1 text-xs font-medium text-white hover:bg-slate-900/75"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  <p className="text-xs text-slate-400 mt-1">
                    Optional. Upload a new profile photo.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-600">
                <Button
                  type="button"
                  onClick={handleSaveChanges}
                  label="Save Changes"
                  loading={isSaving}
                  loadingLabel="Saving..."
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                />
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  label="Cancel"
                  loading={isSaving}
                  loadingLabel="Please wait..."
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInformationCard;
