import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header: React.FC = () => {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const isJobSeeker = user?.role === 'job_seeker';
  
  // Generate avatar URL based on username
  const avatarUrl = useMemo(() => {
    if (!user?.username) return '';
    
    // Using DiceBear API for avatar generation
    // Documentation: https://www.dicebear.com/styles/avataaars
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.username)}&radius=50`;
  }, [user?.username]);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <i className="fas fa-heartbeat text-primary text-xl mr-2"></i>
              <span className="font-bold text-xl text-primary">HealthInfoJobs</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <div className="relative">
                <div className="bg-white flex items-center space-x-2 text-sm rounded-full">
                  <span className="sr-only">User profile</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.name || 'User'}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {isJobSeeker ? 'Job Seeker' : 'HR Professional'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center md:hidden">
              <button 
                type="button" 
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} block h-6 w-6`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {isJobSeeker ? (
              <>
                <Link href="/">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-primary border-l-4 border-primary">
                    Dashboard
                  </a>
                </Link>
                <Link href="/roles">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                    Job Roles
                  </a>
                </Link>
                <Link href="/skills">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                    Skills Analysis
                  </a>
                </Link>
                <Link href="/salary">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                    Salary Explorer
                  </a>
                </Link>
                <Link href="/locations">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                    Location Insights
                  </a>
                </Link>
              </>
            ) : (
              <>
                <Link href="/hr/dashboard">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-primary border-l-4 border-primary">
                    HR Dashboard
                  </a>
                </Link>
                <Link href="/hr/trends">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                    Market Trends
                  </a>
                </Link>
                <Link href="/hr/benchmark">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                    Salary Benchmarking
                  </a>
                </Link>
                <Link href="/hr/skills-gap">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                    Skill Gap Analysis
                  </a>
                </Link>
                <Link href="/">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                    Job Seeker View
                  </a>
                </Link>
              </>
            )}
            <button
              onClick={handleLogout} 
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarUrl} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-primary text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
