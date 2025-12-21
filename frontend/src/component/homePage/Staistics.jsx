import { Package, Users, MapPin, Award } from 'lucide-react';
const Staistics = () => {

const stats = [
    { icon: Package, value: '10,000+', label: 'Products', color: 'text-blue-600' },
    { icon: Users, value: '5,000+', label: 'Happy Customers', color: 'text-green-600' },
    { icon: MapPin, value: '50+', label: 'Cities Covered', color: 'text-purple-600' },
    { icon: Award, value: '4.8', label: 'Average Rating', color: 'text-yellow-600' },
  ];

  return (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 mb-4 ${stat.color}`}>
                  <stat.icon size={32} />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
  )
}

export default Staistics