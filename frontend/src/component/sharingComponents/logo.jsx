import { cn } from '../../lib/utils'
import logo from '../../assets/logo-nearbuy.png'

const Logo = (props) => {
  return (
    <>
        <img src={logo} alt='NearBuy Logo' className={cn('h-12 ml-2', props.className)} />
    </>
  )
}

export default Logo