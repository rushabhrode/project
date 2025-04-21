import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BorrowRecord, Book, User } from '../../types';
import { Calendar, User as UserIcon, BookOpen, Check, AlertCircle } from 'lucide-react';

interface BorrowingItemProps {
  borrowing: BorrowRecord;
  book: Book;
  user: User;
  onReturn: (id: string) => void;
}

const BorrowingItem: React.FC<BorrowingItemProps> = ({ borrowing, book, user, onReturn }) => {
  const { t } = useLanguage();
  
  // Calculate if overdue
  const isOverdue = !borrowing.returnDate && new Date(borrowing.dueDate) < new Date();
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`p-4 border-b dark:border-gray-700 ${isOverdue ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {book.coverImage ? (
              <img 
                src={book.coverImage} 
                alt={book.title}
                className="w-16 h-20 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <BookOpen size={24} className="text-gray-400" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{book.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <UserIcon size={14} className="mr-1" />
              <span>{user.name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Borrowed on</div>
            <div className="flex items-center text-sm">
              <Calendar size={14} className="mr-1 text-blue-500" />
              <span>{formatDate(borrowing.borrowDate)}</span>
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Due date</div>
            <div className="flex items-center text-sm">
              <Calendar size={14} className={`mr-1 ${isOverdue ? 'text-red-500' : 'text-amber-500'}`} />
              <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                {formatDate(borrowing.dueDate)}
              </span>
              {isOverdue && 
                <AlertCircle size={14} className="ml-1 text-red-500" />
              }
            </div>
          </div>
          
          {borrowing.returnDate ? (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Returned on</div>
              <div className="flex items-center text-sm">
                <Check size={14} className="mr-1 text-green-500" />
                <span>{formatDate(borrowing.returnDate)}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onReturn(borrowing.id)}
              className="ml-auto self-end px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md flex items-center gap-1 transition-colors"
            >
              <Check size={14} />
              {t('book.return')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface BorrowingsListProps {
  borrowings: BorrowRecord[];
  books: Record<string, Book>;
  users: Record<string, User>;
  onReturn: (id: string) => void;
}

const BorrowingsList: React.FC<BorrowingsListProps> = ({ 
  borrowings,
  books,
  users,
  onReturn
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Borrowing Records</h2>
      </div>
      
      {borrowings.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No borrowing records found.
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {borrowings.map(borrowing => (
            <BorrowingItem 
              key={borrowing.id}
              borrowing={borrowing}
              book={books[borrowing.bookId]}
              user={users[borrowing.userId]}
              onReturn={onReturn}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BorrowingsList;