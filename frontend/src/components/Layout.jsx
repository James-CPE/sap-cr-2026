import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                ระบบข้อมูลสุขภาพจังหวัดเชียงราย
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/dashboard')
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                แดชบอร์ด
              </Link>
              <Link
                to="/facilities"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/facilities')
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                สถานพยาบาล
              </Link>
              <Link
                to="/statistics"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/statistics')
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                สถิติ
              </Link>
              <button 
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
