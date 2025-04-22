import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';
import type { Book, BorrowRecord } from '../types';

// Aliased icons to avoid name clashes
import {
  BookOpen as BookOpenIcon,
  Calendar as CalendarIcon,
  Languages as LanguagesIcon,
  Bookmark as BookmarkIcon,
  Clock as ClockIcon,
  Share2 as ShareIcon,
  Heart as HeartIcon,
  BookCheck as BookCheckIcon,
  Edit as EditIcon,
  BookX as BookXIcon,
  ArrowLeft as ArrowLeftIcon,
  Loader2 as LoaderIcon,
  AlertCircle as AlertIcon,
} from 'lucide-react';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
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
  }>({ isBorrowed: false, isOverdue: false });

  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [borrowingHistory, setBorrowingHistory] = useState<BorrowRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'history'>('description');
  const [isLiked, setIsLiked] = useState(false);

  // Fetch book, related books, and borrow records
  useEffect(() => {
    if (!id) {
      setError('Invalid book ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    // 1. Fetch the book detail
    fetch(`/api/books/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Book not found');
        return res.json() as Promise<Book>;
      })
      .then(fetchedBook => {
        setBook(fetchedBook);

        // 2. Fetch all books to compute related
        return fetch('/api/books')
          .then(res => res.json() as Promise<Book[]>)
          .then(allBooks => {
            const related = allBooks
              .filter(b =>
                (b.genre === fetchedBook.genre || b.author === fetchedBook.author) &&
                b.id !== fetchedBook.id
              )
              .slice(0, 3);
            setRelatedBooks(related);
          });
      })
      .then(() => {
        // 3. Fetch all borrow records
        return fetch('/api/borrowings')
          .then(res => res.json() as Promise<BorrowRecord[]>)
          .then(records => {
            // Check if current user has borrowed & not returned
            if (user) {
              const myRec = records.find(r =>
                r.bookId === id &&
                r.userId === user.id &&
                !r.returnDate
              );
              if (myRec) {
                const overdue = new Date(myRec.dueDate) < new Date();
                setBorrowStatus({
                  isBorrowed: true,
                  borrowDate: myRec.borrowDate,
                  dueDate: myRec.dueDate,
                  isOverdue: overdue,
                });
              }
            }
            // If admin, show full history for this book
            if (isAdmin) {
              setBorrowingHistory(records.filter(r => r.bookId === id));
            }
          });
      })
      .catch(err => setError(err.message || 'Error loading data'))
      .finally(() => setLoading(false));
  }, [id, user, isAdmin]);

  // Borrow / return button handlers (still demo only)
  const handleBorrow = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/books/${id}` } } });
      return;
    }
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 14);
    setBorrowStatus({
      isBorrowed: true,
      borrowDate: today.toISOString().split('T')[0],
      dueDate: due.toISOString().split('T')[0],
      isOverdue: false,
    });
    if (book) setBook({ ...book, available: false });
  };

  const handleReturn = () => {
    setBorrowStatus({ isBorrowed: false, isOverdue: false });
    if (book) setBook({ ...book, available: true });
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString() : '';

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <LoaderIcon size={48} className="animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout>
        <div className="max-w-md mx-auto my-12 p-6 bg-white rounded shadow">
          <AlertIcon size={48} className="text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Book Not Found</h1>
          <p className="mb-6">{error || 'Unable to find the requested book.'}</p>
          <Link
            to="/books"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Books
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Header with back link */}
        <Link to="/books" className="flex items-center text-blue-600 mb-6">
          <ArrowLeftIcon size={16} className="mr-1" />
          {t('book.backToList')}
        </Link>

        {/* Book Detail Card */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <div className="md:flex gap-6">
            <div className="w-48 flex-shrink-0">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="rounded shadow"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
                  <BookOpenIcon size={48} className="text-gray-400" />
                </div>
              )}
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                  book.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {book.available ? t('book.available') : t('book.unavailable')}
              </span>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-gray-700 mb-4">{book.author}</p>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <CalendarIcon size={18} className="mr-1" />
                  {t('book.year')}: {book.publishedYear}
                </div>
                <div className="flex items-center">
                  <BookmarkIcon size={18} className="mr-1" />
                  {t('book.genre')}: {book.genre}
                </div>
                <div className="flex items-center">
                  <LanguagesIcon size={18} className="mr-1" />
                  {t('book.language')}: {book.language}
                </div>
                <div className="flex items-center">
                  <BookOpenIcon size={18} className="mr-1" />
                  ISBN: {book.isbn}
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                {book.available && !borrowStatus.isBorrowed && user ? (
                  <button
                    onClick={handleBorrow}
                    className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-1"
                  >
                    <BookCheckIcon size={16} />
                    {t('book.borrow')}
                  </button>
                ) : borrowStatus.isBorrowed ? (
                  <button
                    onClick={handleReturn}
                    className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-1"
                  >
                    <BookCheckIcon size={16} />
                    {t('book.return')}
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-300 text-gray-600 rounded flex items-center gap-1"
                  >
                    <BookXIcon size={16} />
                    {t('book.unavailable')}
                  </button>
                )}

                {isAdmin && (
                  <Link
                    to={`/admin/books/edit/${book.id}`}
                    className="px-4 py-2 bg-amber-600 text-white rounded flex items-center gap-1"
                  >
                    <EditIcon size={16} />
                    {t('admin.editBook')}
                  </Link>
                )}

                <button
                  onClick={() => setIsLiked(l => !l)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <HeartIcon size={20} className={isLiked ? 'text-red-500' : ''} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <ShareIcon size={20} />
                </button>
              </div>

              {borrowStatus.isBorrowed && (
                <div
                  className={`p-3 rounded text-sm flex items-center gap-2 ${
                    borrowStatus.isOverdue
                      ? 'bg-red-50 text-red-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  <ClockIcon size={18} />
                  <div>
                    <p className="font-medium">
                      {borrowStatus.isOverdue
                        ? t('book.overdue')
                        : t('book.borrowed')}
                    </p>
                    <p>
                      {t('book.borrowedOn')}: {formatDate(borrowStatus.borrowDate)} |{' '}
                      {t('book.dueDate')}: {formatDate(borrowStatus.dueDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded shadow mb-8">
          <nav className="flex border-b">
            {(['description', 'details', 'history'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-center ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                disabled={tab === 'history' && !isAdmin}
              >
                {t(`book.${tab}`)}
              </button>
            ))}
          </nav>
          <div className="p-6">
            {activeTab === 'description' && (
              <p>{book.description || t('book.noDescription')}</p>
            )}
            {activeTab === 'details' && (
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <dt className="font-medium">{t('book.isbn')}:</dt>
                  <dd>{book.isbn}</dd>
                </div>
                <div>
                  <dt className="font-medium">{t('book.year')}:</dt>
                  <dd>{book.publishedYear}</dd>
                </div>
                <div>
                  <dt className="font-medium">{t('book.language')}:</dt>
                  <dd>{book.language}</dd>
                </div>
                <div>
                  <dt className="font-medium">{t('book.genre')}:</dt>
                  <dd>{book.genre}</dd>
                </div>
              </dl>
            )}
            {activeTab === 'history' && isAdmin && (
              borrowingHistory.length === 0 ? (
                <p>{t('book.noBorrowingHistory')}</p>
              ) : (
                <table className="w-full text-left text-gray-700">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">{t('book.user')}</th>
                      <th className="p-2">{t('book.borrowDate')}</th>
                      <th className="p-2">{t('book.dueDate')}</th>
                      <th className="p-2">{t('book.returnDate')}</th>
                      <th className="p-2">{t('book.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowingHistory.map(r => {
                      const overdue = !r.returnDate && new Date(r.dueDate) < new Date();
                      return (
                        <tr key={r.id} className="border-t">
                          <td className="p-2">{r.userId}</td>
                          <td className="p-2">{formatDate(r.borrowDate)}</td>
                          <td className="p-2">{formatDate(r.dueDate)}</td>
                          <td className="p-2">
                            {r.returnDate ? formatDate(r.returnDate) : '-'}
                          </td>
                          <td className="p-2">
                            {r.returnDate
                              ? t('book.returned')
                              : overdue
                              ? t('book.overdue')
                              : t('book.borrowed')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {t('book.relatedBooks')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBooks.map(rb => (
                <Link
                  key={rb.id}
                  to={`/books/${rb.id}`}
                  className="block bg-white rounded shadow overflow-hidden"
                >
                  <img
                    src={rb.coverImage}
                    alt={rb.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{rb.title}</h3>
                    <p className="text-sm text-gray-600">{rb.author}</p>
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
