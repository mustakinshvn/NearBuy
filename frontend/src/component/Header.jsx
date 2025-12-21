import Logo from './sharingComponents/logo'
import Cart from './headerComponents/Cart'
import ProfileLogo from './headerComponents/ProfileLogo'
import Navbar from './headerComponents/NavBar'
import SearchBar from './headerComponents/SearchBar'
const Header = () => {
  return (
    <>
      <div className='mb-10 mt-2 shadow-lg p-4 sticky top-0 z-50 bg-white rounded-md ml-2 mr-2'>
        <div className='flex items-center justify-between gap-4'>
         
          <div className='flex items-center gap-3'>
            <div className='lg:hidden'>
              <Navbar/>
            </div>
            <Logo />
          </div>
                   
          
          <div className='flex items-center space-x-6 text-3xl font-extrabold'>
            <div className='hidden lg:block'>
              <Navbar/>
            </div>

         <div className='hidden lg:flex flex-1 justify-center px-8'>
            <SearchBar />
          </div>

            <Cart/>
            <ProfileLogo/>                 
          </div>
        </div>
        
  
        <div className='lg:hidden mt-4'>
          <SearchBar />
        </div>
      </div>
    </>
  )
}

export default Header