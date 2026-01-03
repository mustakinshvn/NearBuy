import { Lock, Shield, LogOut } from 'lucide-react';

const SecuritySettings = ({ handleLogout }) => {
  return (
    <div className="bg-linear-to-b from-slate-700 to-slate-800 rounded-2xl border border-slate-600/50 backdrop-blur p-8">
      <h3 className="text-2xl font-bold text-white mb-8">Security Settings</h3>
      <div className="space-y-6">
        <div className="p-6 bg-slate-600/30 rounded-lg border border-slate-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg mt-1">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Change Password</p>
                <p className="text-slate-400 text-sm mt-1">Update your password regularly to keep your account secure</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap">
              Change
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-600/30 rounded-lg border border-slate-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg mt-1">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Two-Factor Authentication</p>
                <p className="text-slate-400 text-sm mt-1">Add an extra layer of security to your account</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors whitespace-nowrap">
              Enable
            </button>
          </div>
        </div>

        <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/20 rounded-lg mt-1">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Logout</p>
                <p className="text-slate-400 text-sm mt-1">Sign out of your account on all devices</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;