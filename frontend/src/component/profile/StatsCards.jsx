import { Package, Zap, Heart } from 'lucide-react';

const StatsCards = ({ totalOrders, totalSpent }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-linear-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-300 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-white mt-2">{totalOrders}</p>
          </div>
          <Package className="w-10 h-10 text-blue-400 opacity-50" />
        </div>
      </div>

      <div className="bg-linear-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-300 text-sm font-medium">Total Spent</p>
            <p className="text-3xl font-bold text-white mt-2">৳{totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
          </div>
          <Zap className="w-10 h-10 text-green-400 opacity-50" />
        </div>
      </div>

      <div className="bg-linear-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-300 text-sm font-medium">Wishlist</p>
            <p className="text-3xl font-bold text-white mt-2">0</p>
          </div>
          <Heart className="w-10 h-10 text-purple-400 opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;