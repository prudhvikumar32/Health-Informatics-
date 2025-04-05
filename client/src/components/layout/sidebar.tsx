import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const isJobSeeker = user?.role === 'job_seeker';
  const isHR = user?.role === 'hr';
  
  const isActive = (path: string) => {
    return location === path ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
  };
  
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {isJobSeeker && (
                <>
                  <Link href="/">
                    <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/')}`}>
                      <i className="fas fa-chart-line mr-3 h-4 w-4"></i>
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/roles">
                    <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/roles')}`}>
                      <i className="fas fa-briefcase mr-3 h-4 w-4"></i>
                      Job Roles
                    </a>
                  </Link>
                  <Link href="/skills">
                    <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/skills')}`}>
                      <i className="fas fa-laptop-code mr-3 h-4 w-4"></i>
                      Skills Analysis
                    </a>
                  </Link>
                  <Link href="/salary">
                    <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/salary')}`}>
                      <i className="fas fa-dollar-sign mr-3 h-4 w-4"></i>
                      Salary Explorer
                    </a>
                  </Link>
                  <Link href="/locations">
                    <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/locations')}`}>
                      <i className="fas fa-map-marker-alt mr-3 h-4 w-4"></i>
                      Location Insights
                    </a>
                  </Link>
                </>
              )}
              
              {isHR && (
                <>
                  <Link href="/hr/dashboard">
                    <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/hr/dashboard')}`}>
                      <i className="fas fa-chart-line mr-3 h-4 w-4"></i>
                      HR Dashboard
                    </a>
                  </Link>
                  <Link href="/hr/trends">
                    <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/hr/trends')}`}>
                      <i className="fas fa-analytics mr-3 h-4 w-4"></i>
                      Market Trends
                    </a>
                  </Link>
                  <Link href="/hr/benchmark">
                    <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/hr/benchmark')}`}>
                      <i className="fas fa-balance-scale mr-3 h-4 w-4"></i>
                      Salary Benchmarking
                    </a>
                  </Link>
                  <Link href="/hr/skills-gap">
                    <a className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/hr/skills-gap')}`}>
                      <i className="fas fa-puzzle-piece mr-3 h-4 w-4"></i>
                      Skill Gap Analysis
                    </a>
                  </Link>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Job Seeker View
                    </h3>
                    <Link href="/">
                      <a className={`mt-2 group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/')}`}>
                        <i className="fas fa-user mr-3 h-4 w-4"></i>
                        Job Seeker Dashboard
                      </a>
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button onClick={handleLogout} className="flex-shrink-0 group block w-full">
              <div className="flex items-center">
                <div>
                  <i className="fas fa-sign-out-alt text-gray-500 group-hover:text-gray-700"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Logout
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
