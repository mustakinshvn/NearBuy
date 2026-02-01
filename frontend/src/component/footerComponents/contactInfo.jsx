import { Mail, Phone, MapPin } from "lucide-react";
const ContactInfo = () => {
  return (
    <div className="flex flex-col items-center ">
      <h4 className="text-lg font-bold mb-4">Contact Us</h4>
      <ul className="space-y-3 flex  items-center justify-center  flex-wrap gap-4">
        <li className="flex items-start gap-2">
          <MapPin className="size-5 text-blue-400  " />
          <span className="text-slate-300">Dhaka, Bangladesh</span>
        </li>
        <li className="flex items-center gap-2">
          <Phone className="size-5 text-green-400 " />
          <span className="text-slate-300">+880 1712-345678</span>
        </li>
        <li className="flex items-center gap-2">
          <Mail className="size-5 text-red-400 " />
          <span className="text-slate-300">support@nearbuy.com</span>
        </li>
      </ul>
    </div>
  );
};

export default ContactInfo;
