import { Edit2, Save, X } from "lucide-react";

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
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${user?.customer_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        const updatedData = await response.json();
        setFormData(updatedData);
        setSuccess(true);
        setIsEditing(false);
        if (onUserUpdate) {
          onUserUpdate(updatedData);
        }
        setTimeout(() => setSuccess(false), 3000);
      } else {
        console.error("Failed to update profile");
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSuccess(false);
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
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-600">
                <button
                  onClick={handleSaveChanges}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInformationCard;
