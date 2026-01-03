import React from 'react';
import { X } from 'lucide-react';

const AlertMessages = ({ error, setError, success, setSuccess }) => {
  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 backdrop-blur">
          <div className="flex-1">
            <p className="text-red-400 font-semibold">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
            <X size={20} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3 backdrop-blur">
          <div className="flex-1">
            <p className="text-green-400 font-semibold">Success</p>
            <p className="text-green-300 text-sm">Profile updated successfully</p>
          </div>
          <button onClick={() => setSuccess(false)} className="text-green-400 hover:text-green-300">
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
};

export default AlertMessages;