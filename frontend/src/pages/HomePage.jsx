import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  MapPin,
  Sparkles
} from 'lucide-react';

import TrustIndicator from '../component/homePage/TrustIndicator';
import WhyChooseUs from '../component/homePage/WhyChooseUs';
import CTASection from '../component/homePage/CTASection';
import Testimonials from '../component/homePage/Testimonials';
import Category from '../component/homePage/Category';
import Staistics from '../component/homePage/Staistics';
import HeroVisual from '../component/homePage/HeroVisual';
import FeaturedProducts from '../component/homePage/FeaturedProducts';
import FeaturedVendors from '../component/homePage/FeaturedVendors';

const HomePage = () => {


  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50">
      <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
           
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles size={16} />
                Welcome to the future of local shopping
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Shop Local,
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
                  Shop Smart
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-lg">
                Discover amazing products from trusted local vendors. Fast delivery, great prices, and exceptional quality - all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <ShoppingBag size={20} />
                  Start Shopping
                  <ArrowRight size={20} />
                </Link>

                <Link
                  to="/shops"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 border border-white/20 backdrop-blur"
                >
                  <MapPin size={20} />
                  Browse Vendors
                </Link>
              </div>
              <TrustIndicator />
            </div>
            <HeroVisual />    
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-100">
       <Staistics />
      </section>

      <section className="py-20 bg-slate-50">
       <Category />
      </section>

      <section className="py-20 bg-white">
        <FeaturedProducts />
      </section>

      <section className="py-20 bg-slate-50">
       <FeaturedVendors />
      </section>

     
      <section className="py-20 bg-white">
        <WhyChooseUs />
      </section>

      
      <section className="py-20 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <Testimonials />
      </section>

      <section className="py-20 bg-slate-50">
       <CTASection/>
      </section>
      
    </div>
  );
};

export default HomePage;