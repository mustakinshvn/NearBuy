import { Link } from "react-router-dom"
import { LinksProps } from "../sharingComponents/Links"
const CustomerService = () => {
  return (
         <div>
            <h4 className="text-lg font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <LinksProps to="/orders" label="My Orders" />
              </li>
              <li>
                <LinksProps to="/track-order" label="Track Order" />
              </li>
              <li>
                <LinksProps to="/return-policy" label="Return Policy" />
              </li>
              <li>
                <LinksProps to="/help-support" label="Help & Support" />
              </li>
              <li>
                <LinksProps to="/terms-conditions" label="Terms & Conditions" />
              </li>
            </ul>
          </div>
  )
}

export default CustomerService