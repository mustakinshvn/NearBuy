import { Link } from "react-router-dom";
import { LinksTo } from "../sharingComponents/LinksTo";
import { ROUTES } from "../../lib/ROUTES";
const CustomerService = () => {
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-lg font-bold mb-4 ">Customer Service</h4>
      <ul className="space-y-2 flex flex-wrap justify-center gap-4">
        <li>
          <LinksTo to={ROUTES.ORDERS} label="My Orders" />
        </li>
        <li>
          <LinksTo to={ROUTES.TRACK_ORDER} label="Track Order" />
        </li>
        <li>
          <LinksTo to={ROUTES.RETURN_POLICY} label="Return Policy" />
        </li>
        <li>
          <LinksTo to={ROUTES.HELP_SUPPORT} label="Help & Support" />
        </li>
        <li>
          <LinksTo to={ROUTES.TERMS_CONDITIONS} label="Terms & Conditions" />
        </li>
      </ul>
    </div>
  );
};

export default CustomerService;
