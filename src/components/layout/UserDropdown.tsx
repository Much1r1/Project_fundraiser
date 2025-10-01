import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Settings, LogOut, ChevronDown, Bell, 
  Heart, TrendingUp, Award, Shield, HelpCircle 
} from 'lucide-react';
import { User as UserType } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface UserDropdownProps {
  user: UserType;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <img
          src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=10b981&color=fff`}
          alt={user.full_name}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-700 dark:text-gray-200 font-medium">
          {user.full_name.split(' ')[0]}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=10b981&color=fff`}
                alt={user.full_name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.full_name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
                <div className="flex items-center mt-1">
                  {isAdmin && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 mr-2">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.verification_status === 'verified' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {user.verification_status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-emerald-50 dark:bg-emerald-900 rounded-lg p-2">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  KES {user.wallet_balance.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300">
                  Wallet Balance
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  7
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Day Streak
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <User className="h-4 w-4 mr-3" />
              My Profile
            </Link>
            
            <Link
              to="/profile?tab=campaigns"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <TrendingUp className="h-4 w-4 mr-3" />
              My Campaigns
            </Link>
            
            <Link
              to="/profile?tab=donations"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Heart className="h-4 w-4 mr-3" />
              My Donations
            </Link>
            
            <Link
              to="/profile?tab=achievements"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Award className="h-4 w-4 mr-3" />
              Achievements
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            
            <Link
              to="/profile?tab=settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="h-4 w-4 mr-3" />
              Account Settings
            </Link>
            
            <Link
              to="/profile?tab=notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="h-4 w-4 mr-3" />
              Notifications
            </Link>
            
            <button
              onClick={() => {
                setIsOpen(false);
                // Help/Support action
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & Support
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;