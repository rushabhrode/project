import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Book } from '../../types';
import { BookOpen, Check, XCircle } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-[1.02] hover:shadow-lg">
      <div className="h-48 overflow-hidden relative">
        {book.coverImage ? (
          <img 
            src={book.coverImage} 
            alt={book.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <BookOpen size={64} className="text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            book.available 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {book.available ? (
              <>
                <Check size={12} className="mr-1" />
                {t('book.available')}
              </>
            ) : (
              <>
                <XCircle size={12} className="mr-1" />
                {t('book.unavailable')}
              </>
            )}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2">{book.author}</p>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-700 dark:text-gray-300">
              {book.genre}
            </span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-700 dark:text-gray-300">
              {book.language}
            </span>
          </div>
          <Link 
            to={`/books/${book.id}`}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
          >
            {t('book.details')}
          </Link>
        </div>

        {book.available && (
          <button 
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            {t('book.borrow')}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;