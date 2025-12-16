import { Mail, Phone, MapPin } from 'lucide-react';
const ContactInfo = () => {
  return (
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-slate-300">Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">+880 1712-345678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-slate-300">support@nearbuy.com</span>
              </li>
            </ul>
          </div>
  )
}

export default ContactInfo