import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';
import { Book, Clock, BookmarkCheck, User, AlertCircle, Calendar, BookOpen } from 'lucide-react';
import { mockBorrowings } from '../../data/mockData';
import { BorrowRecord } from '../../types';
import { getBookMap } from '../../data/mockData';

const UserDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [userBorrowings, setUserBorrowings] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const bookMap = getBookMap();

  useEffect(() => {
    // Simulate API call to fetch user borrowings
    setTimeout(() => {
      if (user) {
        // Filter borrowings for the current user
        const userRecords = mockBorrowings.filter(
          borrowing => borrowing.userId === user.id
        );
        setUserBorrowings(userRecords);
      }
      setLoading(false);
    }, 500);
  }, [user]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate if a book is overdue
  const isOverdue = (dueDate: string, returnDate: string | null) => {
    if (returnDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <User size={32} className="text-blue-600 dark:text-blue-400" />
            {t('user.dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {user?.name}. Manage your borrowings and profile here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4 transition-transform hover:transform hover:scale-[1.02]">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Book size={24} className="text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userBorrowings.filter(b => !b.returnDate).length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Active Borrowings</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4 transition-transform hover:transform hover:scale-[1.02]">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <BookmarkCheck size={24} className="text-green-600 dark:text-green-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userBorrowings.filter(b => b.returnDate).length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Returned Books</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4 transition-transform hover:transform hover:scale-[1.02]">
            <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
              <Clock size={24} className="text-amber-600 dark:text-amber-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userBorrowings.filter(b => isOverdue(b.dueDate, b.returnDate)).length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Overdue Books</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors mb-8">
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('user.borrowings')}
            </h2>
            <Link 
              to="/books" 
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Browse for more books
            </Link>
          </div>

          {loading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : userBorrowings.length === 0 ? (
            <div className="p-6 text-center">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                No borrowings yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't borrowed any books yet.
              </p>
              <Link 
                to="/books" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <Book size={18} className="mr-2" />
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {userBorrowings.map(borrowing => {
                const book = bookMap[borrowing.bookId];
                const overdueStatus = isOverdue(borrowing.dueDate, borrowing.returnDate);
                
                return (
                  <div 
                    key={borrowing.id} 
                    className={`p-4 ${overdueStatus ? 'bg-red-50 dark:bg-red-900/20' : ''}`}
                  >
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
                          <Link to={`/books/${book.id}`}>
                            <h3 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                              {book.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
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
                            <Calendar size={14} className={`mr-1 ${overdueStatus ? 'text-red-500' : 'text-amber-500'}`} />
                            <span className={overdueStatus ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                              {formatDate(borrowing.dueDate)}
                            </span>
                            {overdueStatus && 
                              <AlertCircle size={14} className="ml-1 text-red-500" />
                            }
                          </div>
                        </div>
                        
                        {borrowing.returnDate && (
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Returned on</div>
                            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                              <Calendar size={14} className="mr-1" />
                              <span>{formatDate(borrowing.returnDate)}</span>
                            </div>
                          </div>
                        )}
                        
                        {!borrowing.returnDate && (
                          <Link 
                            to={`/books/${book.id}`}
                            className="self-end text-blue-600 dark:text-blue-400 text-sm hover:underline"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    {overdueStatus && (
                      <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded-md text-sm text-red-700 dark:text-red-300 flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        This book is overdue. Please return it as soon as possible to avoid fines.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboardPage;