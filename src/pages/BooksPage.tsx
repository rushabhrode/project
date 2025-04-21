import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/common/Layout';
import Search from '../components/common/Search';
import BookCard from '../components/common/BookCard';
import Pagination from '../components/common/Pagination';
import { mockBooks } from '../data/mockData';
import { Book } from '../types';
import { BookOpenCheck } from 'lucide-react';

const BooksPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(mockBooks);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;
  
  // Apply search and filters
  useEffect(() => {
    let results = [...mockBooks];
    
    // Apply text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.genre && filters.genre !== '') {
      results = results.filter(book => book.genre === filters.genre);
    }
    
    if (filters.language && filters.language !== '') {
      results = results.filter(book => book.language === filters.language);
    }
    
    if (filters.author && filters.author !== '') {
      results = results.filter(book => 
        book.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }
    
    if (filters.year && filters.year !== '') {
      results = results.filter(book => book.publishedYear === parseInt(filters.year));
    }
    
    setFilteredBooks(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filters]);
  
  // Handle search and filter submission
  const handleSearch = (query: string, newFilters: Record<string, string>) => {
    setSearchQuery(query);
    setFilters(newFilters);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpenCheck size={32} className="text-blue-600 dark:text-blue-400" />
            <span>{t('nav.books')}</span>
          </h1>
        </div>
        
        {/* Search Component */}
        <div className="mb-8">
          <Search onSearch={handleSearch} />
        </div>
        
        {/* Results */}
        {currentBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4 text-gray-400">
              <BookOpenCheck size={64} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No books found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {currentBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default BooksPage;