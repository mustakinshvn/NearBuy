import React, { useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext } from './ToastContextObject';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border-2 backdrop-blur-sm animate-fadeIn ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-800'
              : toast.type === 'error'
              ? 'bg-red-50 border-red-500 text-red-800'
              : toast.type === 'warning'
              ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
              : 'bg-blue-50 border-blue-500 text-blue-800'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
            {toast.type === 'error' && <XCircle className="w-6 h-6 text-red-600" />}
            {toast.type === 'warning' && <AlertCircle className="w-6 h-6 text-yellow-600" />}
            {toast.type === 'info' && <Info className="w-6 h-6 text-blue-600" />}
          </div>
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="font-bold text-sm mb-1">{toast.title}</h4>
            )}
            <p className="text-sm">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'info', duration = 3000 }) => {
    const id = Date.now() + Math.random();
    const newToast = { id, title, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback((message, title = 'Success') => {
    return showToast({ title, message, type: 'success' });
  }, [showToast]);

  const error = useCallback((message, title = 'Error') => {
    return showToast({ title, message, type: 'error' });
  }, [showToast]);

  const warning = useCallback((message, title = 'Warning') => {
    return showToast({ title, message, type: 'warning' });
  }, [showToast]);

  const info = useCallback((message, title = 'Info') => {
    return showToast({ title, message, type: 'info' });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
