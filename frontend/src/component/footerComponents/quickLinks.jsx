import { LinksTo } from "../sharingComponents/LinksTo";
import { ROUTES } from "../../lib/ROUTES";
const QuickLinks = () => {
  return (
    <div className="flex flex-col  items-center">
      <h4 className="text-lg font-bold mb-4">Quick Links</h4>
      <ul className="space-y-2 flex flex-wrap gap-4">
        <li>
          <LinksTo to={ROUTES.HOME} label="Home" />
        </li>
        <li>
          <LinksTo to={ROUTES.SHOPS} label="Shops" />
        </li>
        <li>
          <LinksTo to={ROUTES.PRODUCTS} label="Products" />
        </li>
        <li>
          <LinksTo to={ROUTES.ABOUT} label="About Us" />
        </li>
      </ul>
    </div>
  );
};

export default QuickLinks;
