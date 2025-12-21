import { Truck, Shield, Award } from 'lucide-react';

const TrustIndicators = () => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <div className="p-2 sm:p-3 bg-green-50 rounded-lg text-center">
        <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-1" />
        <p className="text-xs font-semibold text-green-700">Free Delivery</p>
      </div>
      <div className="p-2 sm:p-3 bg-blue-50 rounded-lg text-center">
        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-1" />
        <p className="text-xs font-semibold text-blue-700">Secure Payment</p>
      </div>
      <div className="p-2 sm:p-3 bg-purple-50 rounded-lg text-center">
        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mx-auto mb-1" />
        <p className="text-xs font-semibold text-purple-700">Quality Assured</p>
      </div>
    </div>
  );
};

export default TrustIndicators;
