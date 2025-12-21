import { cn } from "../../lib/utils";
const ButtonCardWithoutBG=(Props)=>{
  return <button type ={Props.type} onClick={Props.onClick} className={cn("text-green-600 cursor-pointer ",Props.className)}>  {Props.label}  </button>
}

export default ButtonCardWithoutBG;