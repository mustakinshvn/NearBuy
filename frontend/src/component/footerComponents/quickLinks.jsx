import { LinksProps } from "../sharingComponents/Links"
const QuickLinks = () => {
  return (
        <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <LinksProps to="/" label="Home" />
              </li>
              <li>
                <LinksProps to="/shops" label="Shops" />
              </li>
              <li>
                <LinksProps to="/products" label="Products" />
              </li>
              <li>
                <LinksProps to="/about" label="About Us" />
              </li>
            </ul>
          </div>
  )
}

export default QuickLinks



