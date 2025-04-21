import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Languages } from 'lucide-react';
import { Language } from '../../types';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: t('language.en') },
    { code: 'hi', name: t('language.hi') },
    { code: 'mr', name: t('language.mr') }
  ];

  return (
    <div className="relative group">
      <button 
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Change language"
      >
        <Languages size={18} />
        <span>{languages.find(lang => lang.code === language)?.name}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right transform scale-95 group-hover:scale-100">
        {languages.map(lang => (
          <button
            key={lang.code}
            className={`block w-full text-left px-4 py-2 text-sm ${
              language === lang.code 
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setLanguage(lang.code)}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;