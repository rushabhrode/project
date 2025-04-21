import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';
import BooksManagementPage from './BooksManagementPage';
import UsersManagementPage from './UsersManagementPage';
import BorrowingsManagementPage from './BorrowingsManagementPage';
import { 
  Library, 
  Users, 
  BookCopy, 
  Settings, 
  BarChart3, 
  Layers, 
  ChevronRight
} from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === `/admin${path}` || 
      (path === '' && location.pathname === '/admin');
  };

  const navItems = [
    { 
      path: '', 
      name: 'Dashboard', 
      icon: <BarChart3 size={20} /> 
    },
    { 
      path: '/books', 
      name: t('admin.books'), 
      icon: <Library size={20} /> 
    },
    { 
      path: '/borrowings', 
      name: t('admin.borrowings'), 
      icon: <BookCopy size={20} /> 
    },
    { 
      path: '/users', 
      name: t('admin.users'), 
      icon: <Users size={20} /> 
    },
    { 
      path: '/settings', 
      name: 'Settings', 
      icon: <Settings size={20} /> 
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers size={32} className="text-blue-600 dark:text-blue-400" />
            {t('admin.dashboard')}
          </h1>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle sidebar"
          >
            <ChevronRight size={20} className={`transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className={`md:w-64 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all ${
            sidebarOpen ? 'block' : 'hidden md:block'
          }`}>
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <Users size={20} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map(item => (
                  <li key={item.path}>
                    <Link
                      to={`/admin${item.path}`}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="/books" element={<BooksManagementPage />} />
              <Route path="/users" element={<UsersManagementPage />} />
              <Route path="/borrowings" element={<BorrowingsManagementPage />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const AdminOverview: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-1">Total Books</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
            <Library size={24} className="text-blue-600 dark:text-blue-300" />
          </div>
        </div>
        
        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-1">Active Users</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
          </div>
          <div className="bg-emerald-100 dark:bg-emerald-800 p-3 rounded-full">
            <Users size={24} className="text-emerald-600 dark:text-emerald-300" />
          </div>
        </div>
        
        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800 flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-1">Borrowings</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
          </div>
          <div className="bg-amber-100 dark:bg-amber-800 p-3 rounded-full">
            <BookCopy size={24} className="text-amber-600 dark:text-amber-300" />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-750 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/books"
            className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Library size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-900 dark:text-white">Manage Books</span>
            </div>
          </Link>
          
          <Link
            to="/admin/borrowings"
            className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookCopy size={20} className="text-amber-600 dark:text-amber-400" />
              <span className="font-medium text-gray-900 dark:text-white">Manage Borrowings</span>
            </div>
          </Link>
          
          <Link
            to="/admin/users"
            className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users size={20} className="text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">Manage Users</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const AdminSettings: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            System Settings
          </h3>
          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Enable User Registration</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Allow new users to register accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Send Email Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notify users about due dates and new releases</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto-approve Borrowing Requests</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically approve borrowing requests from trusted users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Library Rules
          </h3>
          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label htmlFor="maxBooksPerUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maximum Books Per User
                </label>
                <div className="flex">
                  <input
                    id="maxBooksPerUser"
                    type="number"
                    defaultValue={5}
                    min={1}
                    max={20}
                    className="w-24 p-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <span className="ml-2 text-gray-600 dark:text-gray-400 self-center">books</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="borrowDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Borrowing Duration
                </label>
                <div className="flex">
                  <input
                    id="borrowDuration"
                    type="number"
                    defaultValue={14}
                    min={1}
                    max={60}
                    className="w-24 p-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <span className="ml-2 text-gray-600 dark:text-gray-400 self-center">days</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="lateFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Late Return Fee
                </label>
                <div className="flex">
                  <input
                    id="lateFee"
                    type="number"
                    defaultValue={0.5}
                    min={0}
                    step={0.1}
                    className="w-24 p-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <span className="ml-2 text-gray-600 dark:text-gray-400 self-center">per day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;