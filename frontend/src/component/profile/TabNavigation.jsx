import { Package, Shield, Lock } from 'lucide-react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', icon: Package, label: 'Overview' },
    { id: 'settings', icon: Shield, label: 'Settings' },
    { id: 'security', icon: Lock, label: 'Security' },
  ];

  return (
    <div className="space-y-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <tab.icon size={18} />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;