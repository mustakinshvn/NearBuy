import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "../sharingComponents/logo";
import { LinksProps } from "../sharingComponents/Links";

const footerAbout = () => {
  return (
    <div className="flex flex-col ">
      <div className="flex items-center gap-2 mb-2">
        <Logo />
      </div>
      <p className="text-slate-300 mb-4">
        Your trusted local marketplace. Connecting customers with quality
        vendors in Bangladesh.
      </p>
      <div className="flex gap-3">
        <a
          href="#"
          className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all"
        >
          <Facebook className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="w-10 h-10 bg-slate-700 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all"
        >
          <Twitter className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="w-10 h-10 bg-slate-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all"
        >
          <Instagram className="w-5 h-5" />
        </a>
        <a
          href="#"
          className="w-10 h-10 bg-slate-700 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      </div>
      <LinksProps
        to="/admin-vendor-login"
        label="Admin/Vendor Login"
        className="w-full py-3 bg-linear-to-r from-gray-500 to-gray-400 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-4 font-semibold text-gray-200 hover:text-gray-400"
      />
    </div>
  );
};

export default footerAbout;
