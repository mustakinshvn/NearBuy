import { cn } from "../../lib/utils"
import { Link } from "react-router-dom"
export const LinksProps = (props) => {
  return <Link to={props.to} className={cn("text-slate-300 hover:text-blue-400 transition-colors", props.className)}>{props.label}</Link>
}

