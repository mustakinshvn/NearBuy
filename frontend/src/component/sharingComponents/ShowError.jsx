export const ShowError = ({ message }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto">
          <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600 mb-6">{message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};
