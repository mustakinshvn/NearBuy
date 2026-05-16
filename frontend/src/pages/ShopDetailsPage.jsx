import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Store } from 'lucide-react';
import { useVendors } from '../hooks/useVendors';
import ShopDetailSection from '../component/shopsPage/ShopDetailSection';
import { ShowLoading } from '../component/sharingComponents/ShowLoading';

const ShopDetailsPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { vendors, loading, error } = useVendors();

  const vendor = useMemo(
    () => vendors.find((item) => String(item.vendor_id) === String(vendorId)) || null,
    [vendors, vendorId],
  );

  if (loading) {
    return <ShowLoading message="Loading shop details..." subMessage="Please wait while we fetch the vendor profile" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-xl w-full">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">Unable to load shop</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/shops"
              className="px-5 py-3 rounded-xl bg-white border-2 border-slate-300 text-slate-700 font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shops
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-xl w-full">
          <h1 className="text-2xl font-bold text-slate-800 mb-3">Shop not found</h1>
          <p className="text-slate-600 mb-6">This shop is unavailable or has been removed.</p>
          <Link
            to="/shops"
            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <button
            onClick={() => navigate('/shops')}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shops
          </button>
        </div>

        <ShopDetailSection vendor={vendor} />
      </div>
    </div>
  );
};

export default ShopDetailsPage;