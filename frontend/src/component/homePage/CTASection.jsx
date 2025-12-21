import { ShoppingBag, Users } from "lucide-react"
import { Link } from "react-router-dom"
const CTASection = () => {
  return (
     <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of customers who trust NearBuy for their local shopping needs
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag size={20} />
              Browse Products
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 border border-slate-200 shadow-sm hover:shadow-md"
            >
              <Users size={20} />
              Join Now
            </Link>
          </div>
        </div>
  )
}

export default CTASection