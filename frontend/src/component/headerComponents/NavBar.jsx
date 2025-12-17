import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Package, Bell, Info, Menu, X, Store } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

const navLinks = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Shops', icon: Store, href: '/shops' },
    { name: 'Products', icon: ShoppingBag, href: '/products' },
    { name: 'Orders', icon: Package, href: '/orders' },
    { name: 'Notifications', icon: Bell, href: '/notifications' },
    { name: 'About', icon: Info, href: '/about' },
  ];

  return (
    
    <>    
      <nav className="hidden lg:flex items-center space-x-10">
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <Link
              key={link.name}
              to={link.href}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg group transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
            >
              <IconComponent className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-110" />
              <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors duration-300 tracking-wide">
                {link.name}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          );
        })}
      </nav>

      
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden relative text-slate-700 hover:text-blue-600 transition-all duration-300 p-2 hover:bg-blue-50 rounded-lg active:scale-95"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

   

      
      {isMobileMenuOpen && (
        <>
          
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={toggleMobileMenu}
          />
          
         
          <div className="lg:hidden fixed top-0 left-0 w-80 h-full bg-gradient-to-b from-white to-slate-50 shadow-2xl z-50 transform transition-transform duration-300 ease-out animate-slideInLeft">
           
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 tracking-wide">Menu</h2>
              <button
                onClick={toggleMobileMenu}
                className="text-slate-500 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            
            <nav className="flex flex-col p-4 space-y-2 mt-4">
              {navLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group border border-transparent hover:border-blue-100 hover:shadow-md active:scale-98"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-all duration-300">
                      <IconComponent className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-all duration-300" />
                    </div>
                    <span className="text-base font-semibold text-slate-700 group-hover:text-blue-600 transition-colors duration-300">
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;