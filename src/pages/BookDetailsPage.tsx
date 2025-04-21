import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';
import { 
  BookOpen, 
  Calendar, 
  Languages, 
  Bookmark, 
  Clock, 
  Share2, 
  Heart,
  BookCheck,
  Edit,
  BookX,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { mockBooks, mockBorrowings } from '../data/mockData';
import { Book, BorrowRecord } from '../types';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [borrowStatus, setBorrowStatus] = useState<{
    isBorrowed: boolean;
    borrowDate?: string;
    dueDate?: string;
    isOverdue: boolean;
  }>({
    isBorrowed: false,
    isOverdue: false
  });
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState('description');
  const [borrowingHistory, setBorrowingHistory] = useState<BorrowRecord[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  
  // Simulate fetching book details
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (id) {
        const foundBook = mockBooks.find(book => book.id === id);
        
        if (foundBook) {
          setBook(foundBook);
          
          // Find related books (same genre or author, excluding current book)
          const related = mockBooks.filter(
            b => (b.genre === foundBook.genre || b.author === foundBook.author) && b.id !== foundBook.id
          ).slice(0, 3);
          
          setRelatedBooks(related);
          
          // Check if the book is borrowed by the current user
          if (user) {
            const userBorrowRecord = mockBorrowings.find(
              b => b.bookId === id && b.userId === user.id && !b.returnDate
            );
            
            if (userBorrowRecord) {
              const isOverdue = new Date(userBorrowRecord.dueDate) < new Date();
              
              setBorrowStatus({
                isBorrowed: true,
                borrowDate: userBorrowRecord.borrowDate,
                dueDate: userBorrowRecord.dueDate,
                isOverdue
              });
            }
            
            // For admin, get all borrowing history for this book
            if (isAdmin) {
              const bookHistory = mockBorrowings.filter(b => b.bookId === id);
              setBorrowingHistory(bookHistory);
            }
          }
        } else {
          setError('Book not found');
        }
      } else {
        setError('Invalid book ID');
      }
      
      setLoading(false);
    }, 800);
  }, [id, user, isAdmin]);
  
  // Handle borrowing book
  const handleBorrow = () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login', { 
        state: { from: { pathname: `/books/${id}` } } 
      });
      return;
    }
    
    // In a real app, this would be an API call to borrow the book
    
    // For demo, just update the UI
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14); // 2 weeks from now
    
    setBorrowStatus({
      isBorrowed: true,
      borrowDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      isOverdue: false
    });
    
    // Also update the book's available status
    if (book) {
      setBook({ ...book, available: false });
    }
  };
  
  // Handle returning book
  const handleReturn = () => {
    // In a real app, this would be an API call to return the book
    
    // For demo, just update the UI
    setBorrowStatus({
      isBorrowed: false,
      isOverdue: false
    });
    
    // Also update the book's available status
    if (book) {
      setBook({ ...book, available: true });
    }
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 size={48} className="text-blue-600 dark:text-blue-400 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading book details...</p>
        </div>
      </Layout>
    );
  }
  
  if (error || !book) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto my-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Book Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'Unable to find the requested book.'}</p>
            <Link 
              to="/books" 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Books
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Book Header */}
        <div className="mb-6">
          <Link 
            to="/books" 
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft size={16} />
            <span>{t('book.backToList')}</span>
          </Link>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl p-6 md:p-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex justify-center md:justify-start">
                <div className="relative w-48 h-64 transform transition-transform duration-500 hover:scale-105 hover:-rotate-1">
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center">
                      <BookOpen size={48} className="text-gray-400" />
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      book.available 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {book.available ? t('book.available') : t('book.unavailable')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {book.title}
                </h1>
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                  <span className="text-lg">{book.author}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar size={18} className="mr-2 text-gray-500" />
                    <span>{t('book.year')}: {book.publishedYear}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Bookmark size={18} className="mr-2 text-gray-500" />
                    <span>{t('book.genre')}: {book.genre}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Languages size={18} className="mr-2 text-gray-500" />
                    <span>{t('book.language')}: {book.language}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <BookOpen size={18} className="mr-2 text-gray-500" />
                    <span>ISBN: {book.isbn}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  {book.available && !borrowStatus.isBorrowed && user ? (
                    <button
                      onClick={handleBorrow}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
                    >
                      <BookCheck size={18} />
                      {t('book.borrow')}
                    </button>
                  ) : borrowStatus.isBorrowed ? (
                    <button
                      onClick={handleReturn}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2 transition-colors"
                    >
                      <BookCheck size={18} />
                      {t('book.return')}
                    </button>
                  ) : !book.available && (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md flex items-center gap-2 cursor-not-allowed"
                    >
                      <BookX size={18} />
                      {t('book.unavailable')}
                    </button>
                  )}
                  
                  {isAdmin && (
                    <Link
                      to={`/admin/books/edit/${book.id}`}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md flex items-center gap-2 transition-colors"
                    >
                      <Edit size={18} />
                      {t('admin.editBook')}
                    </Link>
                  )}
                  
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                    }`}
                    aria-label="Like"
                  >
                    <Heart size={20} className={isLiked ? 'fill-red-500' : ''} />
                  </button>
                  
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
                
                {borrowStatus.isBorrowed && (
                  <div className={`mt-4 p-3 rounded-md flex items-center gap-2 ${
                    borrowStatus.isOverdue 
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' 
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  }`}>
                    <Clock size={18} />
                    <div>
                      <p className="text-sm font-medium">
                        {borrowStatus.isOverdue 
                          ? t('book.overdue') 
                          : t('book.borrowed')}
                      </p>
                      <p className="text-sm">
                        {t('book.borrowedOn')}: {formatDate(borrowStatus.borrowDate)} | 
                        {t('book.dueDate')}: {formatDate(borrowStatus.dueDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Book Content Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'description'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('book.description')}
              </button>
              
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'details'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('book.details')}
              </button>
              
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                    activeTab === 'history'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {t('book.borrowingHistory')}
                </button>
              )}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {book.description || t('book.noDescription')}
                </p>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {t('book.bookDetails')}
                    </h3>
                    <dl className="space-y-2">
                      <div className="flex">
                        <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">{t('book.isbn')}:</dt>
                        <dd className="text-gray-900 dark:text-white">{book.isbn}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">{t('book.year')}:</dt>
                        <dd className="text-gray-900 dark:text-white">{book.publishedYear}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">{t('book.language')}:</dt>
                        <dd className="text-gray-900 dark:text-white">{book.language}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">{t('book.genre')}:</dt>
                        <dd className="text-gray-900 dark:text-white">{book.genre}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">{t('book.status')}:</dt>
                        <dd>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            book.available 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {book.available ? t('book.available') : t('book.unavailable')}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {t('book.aboutAuthor')}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t('book.authorInfoPlaceholder')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'history' && isAdmin && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('book.borrowingHistory')}
                </h3>
                
                {borrowingHistory.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">{t('book.noBorrowingHistory')}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-750">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('book.user')}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('book.borrowDate')}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('book.dueDate')}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('book.returnDate')}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('book.status')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {borrowingHistory.map((record) => {
                          const isRecordOverdue = !record.returnDate && new Date(record.dueDate) < new Date();
                          
                          return (
                            <tr key={record.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                User #{record.userId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(record.borrowDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(record.dueDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {record.returnDate ? formatDate(record.returnDate) : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {record.returnDate ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    {t('book.returned')}
                                  </span>
                                ) : isRecordOverdue ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                    {t('book.overdue')}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {t('book.borrowed')}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('book.relatedBooks')}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBooks.map(relatedBook => (
                <Link
                  key={relatedBook.id}
                  to={`/books/${relatedBook.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="h-40 overflow-hidden relative">
                    {relatedBook.coverImage ? (
                      <img 
                        src={relatedBook.coverImage} 
                        alt={relatedBook.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <BookOpen size={32} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        relatedBook.available 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {relatedBook.available ? t('book.available') : t('book.unavailable')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{relatedBook.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{relatedBook.author}</p>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-700 dark:text-gray-300">
                          {relatedBook.genre}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookDetailsPage;