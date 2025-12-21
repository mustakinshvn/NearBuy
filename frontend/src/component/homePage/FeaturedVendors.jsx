import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Star, Package, ShoppingBag } from 'lucide-react';
import { useVendors } from '../../hooks/useVendors';

const FeaturedVendors = () => {
  const { vendors, loading: vendorsLoading } = useVendors();

  const featuredVendors = vendors?.slice(0, 6) || [];


  const VendorAvatar = ({ vendor }) => {
    const [imgError, setImgError] = useState(false);
    const logo = vendor?.logo || vendor?.image || vendor?.avatar || null;
    const name = vendor?.shop_name || vendor?.name || 'Vendor';

    const wrapperClass = 'w-16 h-16 flex items-center justify-center rounded-xl';
    const innerClass = 'w-14 h-14 rounded-lg flex items-center justify-center text-lg font-semibold text-white';

    if (logo && !imgError) {
      return (
        <div className={wrapperClass}>
          <img
            src={logo}
            alt={`Logo of ${name}`}
            className="w-14 h-14 rounded-lg object-cover border border-slate-100"
            onError={() => setImgError(true)}
          />
        </div>
      );
    }

    return (
      <div className={wrapperClass} aria-hidden>
        <div className={`${innerClass} bg-linear-to-br from-green-500 to-blue-600`}>
         
         <ShoppingBag size={24} className="text-white" /> 
          
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Featured Vendors</h2>
        <p className="text-md md:text-lg text-slate-600 max-w-2xl mx-auto">
          Connect with trusted local vendors nearby — curated for quality and service.
        </p>
      </div>

      {vendorsLoading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse"
              aria-hidden
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {featuredVendors.map((vendor) => (
            <article
              key={vendor?.vendor_id ?? vendor?.id}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-slate-100"
            >
              <Link
                to={{ pathname: '/shops', search: `?vendor=${vendor?.vendor_id || vendor?.id}` }}
                aria-label={`View shop ${vendor?.shop_name || vendor?.name || 'vendor'}`}
                className="block"
              >
                <div className="flex items-center gap-4 mb-3">
                  <VendorAvatar vendor={vendor} />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {vendor?.shop_name || vendor?.name || 'Local Vendor'}
                    </h3>
                    <p className="text-slate-600 text-sm truncate">{vendor?.city || vendor?.area || 'Nearby'}</p>
                  </div>
                </div>

                <p className="text-slate-700 text-sm mb-3 line-clamp-2">{vendor?.description || vendor?.shop_type || ''}</p>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-400" />
                    <span className="font-medium">4.8</span>
                    <span className="text-xs">(120)</span>
                  </span>

                  <span className="flex items-center gap-2">
                    <Package size={16} />
                    <span className="text-sm">{vendor?.product_count ? `${vendor.product_count}+ products` : 'Products'}</span>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedVendors;