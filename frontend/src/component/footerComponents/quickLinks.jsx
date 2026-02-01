import { LinksTo } from "../sharingComponents/LinksTo";
const QuickLinks = () => {
  return (
    <div className="flex flex-col  items-center">
      <h4 className="text-lg font-bold mb-4">Quick Links</h4>
      <ul className="space-y-2 flex flex-wrap gap-4">
        <li>
          <LinksTo to="/" label="Home" />
        </li>
        <li>
          <LinksTo to="/shops" label="Shops" />
        </li>
        <li>
          <LinksTo to="/products" label="Products" />
        </li>
        <li>
          <LinksTo to="/about" label="About Us" />
        </li>
      </ul>
    </div>
  );
};

export default QuickLinks;
