import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Logo from "../sharingComponents/logo"
const footerAbout = () => {
  return (
       <div>
            <div className="flex items-center gap-2 mb-2">
              <Logo />
            </div>
            <p className="text-slate-300 mb-4">
              Your trusted local marketplace. Connecting customers with quality vendors in Bangladesh.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
            
  )
}

export default footerAbout