import { Link } from "react-router-dom";
import { LinksTo } from "../sharingComponents/LinksTo";
const CustomerService = () => {
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-lg font-bold mb-4 ">Customer Service</h4>
      <ul className="space-y-2 flex flex-wrap justify-center gap-4">
        <li>
          <LinksTo to="/orders" label="My Orders" />
        </li>
        <li>
          <LinksTo to="/track-order" label="Track Order" />
        </li>
        <li>
          <LinksTo to="/return-policy" label="Return Policy" />
        </li>
        <li>
          <LinksTo to="/help-support" label="Help & Support" />
        </li>
        <li>
          <LinksTo to="/terms-conditions" label="Terms & Conditions" />
        </li>
      </ul>
    </div>
  );
};

export default CustomerService;
