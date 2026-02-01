import { RefreshCw } from "lucide-react";

export const ShowLoading = (props) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium text-slate-700">
          {props.message || "Loading..."}
        </p>
        <p className="text-sm text-slate-500 mt-2">
          {props.subMessage || "Please wait while we fetch the latest data"}
        </p>
      </div>
    </div>
  );
};
