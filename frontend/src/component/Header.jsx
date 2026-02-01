import Logo from "./sharingComponents/logo";
import Cart from "./headerComponents/Cart";
import ProfileLogo from "./headerComponents/ProfileLogo";
import Navbar from "./headerComponents/NavBar";
import SearchBar from "./headerComponents/SearchBar";
const Header = () => {
  return (
    <>
      <div className="py-2 mt-2 w-full shadow-lg p-4 sticky top-0 z-50 bg-white rounded-md ">
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-full items-center lg:justify-between gap-3">
            <div className="order-0 lg:order-1">
              <Navbar />
            </div>
            <div className="order-1 lg:order-0  ">
              <Logo />
            </div>
          </div>

          <div className="flex items-center space-x-6 text-3xl font-extrabold">
            <div className="hidden w-full lg:flex  justify-center px-8">
              <SearchBar />
            </div>

            <div className="flex gap-3 lg:gap-5 items-center">
              <Cart />
              <ProfileLogo />
            </div>
          </div>
        </div>

        <div className="lg:hidden w-full mt-4">
          <SearchBar />
        </div>
      </div>
    </>
  );
};

export default Header;
