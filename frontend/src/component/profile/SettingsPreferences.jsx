import { Bell, Heart, Package } from 'lucide-react';

const SettingsPreferences = () => {
  const preferences = [
    { icon: Bell, label: 'Email Notifications', desc: 'Receive order updates and promotions' },
    { icon: Heart, label: 'Wishlist', desc: 'Save favorite products' },
    { icon: Package, label: 'Order History', desc: 'Track all your past orders' },
  ];

  return (
    <div className="bg-linear-to-b from-slate-700 to-slate-800 rounded-2xl border border-slate-600/50 backdrop-blur p-8">
      <h3 className="text-2xl font-bold text-white mb-8">Preferences</h3>
      <div className="space-y-6">
        {preferences.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-slate-600/30 rounded-lg border border-slate-500/30 hover:border-slate-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <item.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold">{item.label}</p>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPreferences;