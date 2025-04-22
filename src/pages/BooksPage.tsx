import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/common/Layout';
import Search from '../components/common/Search';
import BookCard from '../components/common/BookCard';
import Pagination from '../components/common/Pagination';
import { Book } from '../types';
import { BookOpenCheck } from 'lucide-react';

const BooksPage: React.FC = () => {
  const { t } = useLanguage();

  // allBooks holds the full list fetched from backend
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  // filteredBooks is the current, post-search/filter list
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  // 1️⃣ Fetch from Spring API once on mount
  useEffect(() => {
    fetch('/api/books')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
      })
      .then((data: Book[]) => {
        setAllBooks(data);
        setFilteredBooks(data);
      })
      .catch(err => {
        console.error(err);
        setAllBooks([]);
        setFilteredBooks([]);
      });
  }, []);

  // 2️⃣ Re-run search + filters whenever searchQuery or filters change
  useEffect(() => {
    let results = [...allBooks];

    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }

    // Genre filter
    if (filters.genre) {
      results = results.filter(b => b.genre === filters.genre);
    }
    // Language filter
    if (filters.language) {
      results = results.filter(b => b.language === filters.language);
    }
    // Author filter (partial match)
    if (filters.author) {
      const a = filters.author.toLowerCase();
      results = results.filter(b => b.author.toLowerCase().includes(a));
    }
    // Year filter
    if (filters.year) {
      const year = parseInt(filters.year, 10);
      results = results.filter(b => b.publishedYear === year);
    }

    setFilteredBooks(results);
    setCurrentPage(1); // reset to first page on any filter/search change
  }, [searchQuery, filters, allBooks]);

  // 3️⃣ Pagination math
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  // Called by <Search /> when user submits new query/filters
  const handleSearch = (query: string, newFilters: Record<string, string>) => {
    setSearchQuery(query);
    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpenCheck size={32} className="text-blue-600 dark:text-blue-400" />
            <span>{t('nav.books')}</span>
          </h1>
        </div>

        <div className="mb-8">
          <Search onSearch={handleSearch} />
        </div>

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