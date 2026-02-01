import { cn } from "../../lib/utils";
const Button = (Props) => {
  return (
    <button
      type={Props.type}
      onClick={Props.onClick}
      className={cn(
        "w-full py-3 bg-linear-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2",
        Props.className,
      )}
    >
      {Props.icon}
      {Props.label}
    </button>
  );
};

export default Button;
