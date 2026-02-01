const ProfileCard = ({ user, vendor, getInitials }) => {
  return (
    <div className="bg-linear-to-b from-slate-700 to-slate-800 rounded-2xl p-6 mb-6 border border-slate-600/50 backdrop-blur">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <span className="text-white text-3xl font-bold">
            {getInitials(user?.name || vendor?.name || "U")}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          {user?.name || vendor?.name || "User"}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {user?.email || vendor?.email}
        </p>
      </div>

      <div className="border-t border-slate-600 pt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Member Since</span>
          <span className="text-white font-semibold">
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })
              : "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Status</span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-white font-semibold">Active</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
