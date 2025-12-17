import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ShoppingBag, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import ButtonCardWithoutBG from '../sharingComponents/ButtonCardWithoutBG';

const ProfileLogo = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className='flex gap-2'>
    
       <ButtonCardWithoutBG onClick={() => navigate('/login')} className='px-4 py-2 text-lg font-medium ' label="login" />
        <ButtonCard  onClick={() => navigate('/signup')} className='px-4 py-2 text-sm text-white font-medium' label="Sign UP" />
      </div>
    );
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className='flex items-center gap-2 cursor-pointer group'
      >
        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl curosor-pointer'>
          <User className='text-white' size={20} />
        </div>
        <span className='hidden md:block text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors'>
          {user?.name}
        </span>
      </div>

      {showDropdown && (
        <div className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50'>
          <div className='px-4 py-3 border-b border-gray-200'>
            <p className='text-sm font-medium text-gray-900'>{user?.name}</p>
            <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
          </div>
          
          <button
            onClick={() => {
              navigate('/profile');
              setShowDropdown(false);
            }}
            className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer'
          >
            <User size={16} />
            My Profile
          </button>
          
          <button
            onClick={() => {
              navigate('/orders');
              setShowDropdown(false);
            }}
            className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer'
          >
            <ShoppingBag size={16} />
            My Orders
          </button>
          
          <button
            onClick={() => {
              navigate('/notifications');
              setShowDropdown(false);
            }}
            className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer'
          >
            <Bell size={16} />
            Notifications
            {unreadCount > 0 && (
              <span className='ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full cursor-pointer'>
                {unreadCount}
              </span>
            )}
          </button>
          
          <div className='border-t border-gray-200 mt-2 pt-2'>
            <button
              onClick={handleLogout}
              className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer'
            >
              <LogOut size={16} />
              Logout
            </button>
           

          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileLogo;