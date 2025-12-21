import { Shield, Truck, CheckCircle } from "lucide-react";
const TrustIndicator = () => {
  return (
    <div className="flex items-center justify-center lg:justify-start gap-6 mt-12">
        <div className="flex items-center gap-2 text-slate-400">
          <Shield size={16} />
           <span className="text-sm">Secure Payments</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
            <Truck size={16} />
            <span className="text-sm">Fast Delivery</span>
         </div>

        <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle size={16} />
            <span className="text-sm">Quality Guaranteed</span>
        </div>

    </div>
  )
}

export default TrustIndicator