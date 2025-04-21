import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { BookOpen, User, LogOut, LogIn } from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('app.title')}</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/books" 
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t('nav.books')}
            </Link>
            {user && (
              <Link 
                to={isAdmin ? "/admin" : "/dashboard"} 
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t(isAdmin ? 'nav.admin' : 'nav.dashboard')}
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <User size={18} />
                  <span className="hidden md:inline">{user.name}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={t('nav.logout')}
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogIn size={18} />
                <span>{t('nav.login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;