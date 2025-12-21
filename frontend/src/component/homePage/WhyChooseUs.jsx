import { Truck, Shield, Award, Users, Zap, Clock } from "lucide-react";
const WhyChooseUs = () => {
  return (
           <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose NearBuy?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We're committed to providing the best local shopping experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Fast Delivery</h3>
              <p className="text-slate-600">
                Get your orders delivered quickly from local vendors. Same-day delivery available in select areas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Secure Payments</h3>
              <p className="text-slate-600">
                Your payments are protected with industry-standard security. Multiple payment options available.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Quality Guarantee</h3>
              <p className="text-slate-600">
                All products come with quality guarantee. Not satisfied? Get your money back.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Local Support</h3>
              <p className="text-slate-600">
                Connect with local vendors and get personalized support. Build relationships with your community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Best Prices</h3>
              <p className="text-slate-600">
                Competitive pricing from local vendors. No middleman, just direct from source to you.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">24/7 Support</h3>
              <p className="text-slate-600">
                Our customer support team is always ready to help you with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
  )
}

export default WhyChooseUs