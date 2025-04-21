import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BorrowingsList from '../../components/admin/BorrowingsList';
import { Search, BookPlus, Filter, Calendar, CalendarCheck, CalendarX, RefreshCw } from 'lucide-react';
import { mockBorrowings, mockBooks, mockUsers } from '../../data/mockData';
import { getBookMap, getUserMap } from '../../data/mockData';
import { BorrowRecord } from '../../types';

const BorrowingsManagementPage: React.FC = () => {
  const { t } = useLanguage();
  const [borrowings, setBorrowings] = useState<BorrowRecord[]>(mockBorrowings);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string>('all'); // 'all', 'active', 'returned', 'overdue'
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilters, setDateFilters] = useState({
    startDate: '',
    endDate: ''
  });
  
  const bookMap = getBookMap();
  const userMap = getUserMap();
  
  // Handle returning a book
  const handleReturn = (borrowingId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setBorrowings(borrowings.map(borrowing => 
      borrowing.id === borrowingId
        ? { ...borrowing, returnDate: today }
        : borrowing
    ));
  };
  
  // Filter borrowings based on search, filter, and date range
  const filteredBorrowings = borrowings.filter(borrowing => {
    const book = bookMap[borrowing.bookId];
    const user = userMap[borrowing.userId];
    
    // Check search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const bookMatch = book && (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query)
      );
      const userMatch = user && (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
      
      if (!bookMatch && !userMatch) {
        return false;
      }
    }
    
    // Check active/returned/overdue filter
    if (filter === 'active' && borrowing.returnDate) {
      return false;
    }
    if (filter === 'returned' && !borrowing.returnDate) {
      return false;
    }
    if (filter === 'overdue') {
      const isOverdue = !borrowing.returnDate && new Date(borrowing.dueDate) < new Date();
      if (!isOverdue) {
        return false;
      }
    }
    
    // Check date range
    if (dateFilters.startDate) {
      const startDate = new Date(dateFilters.startDate);
      const borrowDate = new Date(borrowing.borrowDate);
      if (borrowDate < startDate) {
        return false;
      }
    }
    
    if (dateFilters.endDate) {
      const endDate = new Date(dateFilters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of the day
      const borrowDate = new Date(borrowing.borrowDate);
      if (borrowDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
  
  // Handle date filter changes
  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilter('all');
    setDateFilters({
      startDate: '',
      endDate: ''
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('admin.borrowings')}
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md flex items-center gap-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Filter size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
            >
              <BookPlus size={18} />
              New Borrowing
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by book title, author, user..."
            className="pl-10 w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-md border border-gray-200 dark:border-gray-700 animate-fadeIn">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              Filter Borrowings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      filter === 'all'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      filter === 'active'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      Active
                    </div>
                  </button>
                  <button
                    onClick={() => setFilter('returned')}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      filter === 'returned'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <CalendarCheck size={16} />
                      Returned
                    </div>
                  </button>
                  <button
                    onClick={() => setFilter('overdue')}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      filter === 'overdue'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <CalendarX size={16} />
                      Overdue
                    </div>
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Borrowed After
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateFilters.startDate}
                  onChange={handleDateFilterChange}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Borrowed Before
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateFilters.endDate}
                  onChange={handleDateFilterChange}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md flex items-center gap-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <RefreshCw size={16} />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Calendar size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {borrowings.filter(b => !b.returnDate).length}
            </p>
            <p className="text-gray-500 dark:text-gray-400">Active Borrowings</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
            <CalendarCheck size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {borrowings.filter(b => b.returnDate).length}
            </p>
            <p className="text-gray-500 dark:text-gray-400">Returned Books</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
            <CalendarX size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {borrowings.filter(b => !b.returnDate && new Date(b.dueDate) < new Date()).length}
            </p>
            <p className="text-gray-500 dark:text-gray-400">Overdue Books</p>
          </div>
        </div>
      </div>
      
      {/* Borrowings List */}
      <BorrowingsList 
        borrowings={filteredBorrowings}
        books={bookMap}
        users={userMap}
        onReturn={handleReturn}
      />
    </div>
  );
};

export default BorrowingsManagementPage;