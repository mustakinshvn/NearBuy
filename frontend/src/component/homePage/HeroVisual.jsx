import { Package, Users, MapPin, Star } from "lucide-react";
const HeroVisual = () => {
  return (
     <div className="relative">
        <div className="relative bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl p-8 backdrop-blur">
            <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">10K+ Products</h3>
                    <p className="text-blue-200 text-sm">From trusted vendors</p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">5K+ Customers</h3>
                    <p className="text-green-200 text-sm">Happy & satisfied</p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">50+ Cities</h3>
                    <p className="text-purple-200 text-sm">Nationwide coverage</p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">4.8 Rating</h3>
                    <p className="text-yellow-200 text-sm">Customer satisfaction</p>
                   </div>
            </div>
        </div>
     </div>
  )
}

export default HeroVisual