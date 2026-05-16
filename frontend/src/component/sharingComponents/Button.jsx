import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
const Button = (Props) => {
  const isLoading = Boolean(Props.loading);
  const variant = Props.variant || "primary";

  const variantClasses = {
    primary:
      "bg-linear-to-r from-green-500 to-blue-500 text-white shadow-lg",
    secondary:
      "bg-white border border-slate-300 text-slate-700 shadow-sm",
  };

  const hoverClasses = {
    primary:
      "hover:from-green-600 hover:to-blue-600 hover:shadow-xl transform hover:scale-[1.02] active:scale-95 cursor-pointer",
    secondary:
      "hover:bg-slate-50 hover:border-slate-400 hover:shadow-md active:scale-95 cursor-pointer",
  };

  return (
    <button
      type={Props.type}
      onClick={Props.onClick}
      className={cn(
        "w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2",
        variantClasses[variant] || variantClasses.primary,
        !isLoading && (hoverClasses[variant] || hoverClasses.primary),
        isLoading && "cursor-not-allowed opacity-80",
        Props.className,
      )}
      disabled={Props.disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{Props.loadingLabel || "Loading..."}</span>
        </>
      ) : (
        <>
          {Props.icon}
          {Props.label}
        </>
      )}
    </button>
  );
};

export default Button;
