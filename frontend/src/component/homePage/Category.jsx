import { Link } from "react-router-dom";
const Category = () => {

 const categories = [
    { name: 'Electronics', icon: '📱', count: '120+' },
    { name: 'Fashion', icon: '👕', count: '85+' },
    { name: 'Home & Garden', icon: '🏠', count: '95+' },
    { name: 'Sports', icon: '⚽', count: '60+' },
    { name: 'Books', icon: '📚', count: '200+' },
    { name: 'Beauty', icon: '💄', count: '75+' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore our wide range of product categories from trusted local vendors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/products"
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-slate-100"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{category.name}</h3>
                <p className="text-slate-500 text-sm">{category.count} products</p>
              </Link>
            ))}
          </div>
        </div>
  )
}

export default Category