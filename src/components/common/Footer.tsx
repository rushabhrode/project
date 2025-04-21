import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Mail, Info, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('app.title')}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('app.tagline')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Info size={16} />
                  <span>{t('footer.about')}</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Mail size={16} />
                  <span>{t('footer.contact')}</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <FileText size={16} />
                  <span>{t('footer.terms')}</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Languages</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t('language.en')}
                </button>
              </li>
              <li>
                <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t('language.hi')}
                </button>
              </li>
              <li>
                <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t('language.mr')}
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            &copy; {currentYear} {t('app.title')}. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;