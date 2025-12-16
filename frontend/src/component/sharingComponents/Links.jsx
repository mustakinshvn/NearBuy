import { Link } from "react-router-dom"
export const LinksProps = (props) => {
  return <Link to={props.to} className="text-slate-300 hover:text-blue-400 transition-colors">{props.label}</Link>
}

