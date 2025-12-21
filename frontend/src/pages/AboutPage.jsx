import { Info, Users, Target, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-100 p-5">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            About <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-600">NearBuy</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Connecting local vendors with customers in your neighborhood
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              To empower local businesses and provide customers with convenient access to quality products from vendors in their area. We believe in supporting local communities and making shopping easier for everyone.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Values</h2>
            <p className="text-slate-600 leading-relaxed">
              We prioritize quality, convenience, and community. Every transaction on NearBuy supports local businesses and helps build stronger neighborhoods. Join us in making a difference!
            </p>
          </div>
        </div>

        <div className="bg-linear-to-r from-green-300 to-blue-300 rounded-2xl shadow-xl p-12 text-center text-white">
          <Users className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
            Thousands of customers and vendors trust NearBuy for their daily shopping needs
          </p>
          <button className="px-8 py-4 bg-linear-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all  shadow-lg cursor-pointer ">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;