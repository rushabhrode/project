import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/common/Layout';
import BookCard from '../components/common/BookCard';

// 1️⃣ Import the Book type
import type { Book } from '../types';

// 2️⃣ Alias the icons so they don't shadow your Book type
import {
  Book as BookIcon,
  Search as SearchIcon,
  Users as UsersIcon,
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch from backend once
  useEffect(() => {
    fetch('/api/books')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
      })
      .then((data: Book[]) => setAllBooks(data))
      .catch(err => {
        console.error(err);
        setAllBooks([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const featuredBooks = allBooks.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t('app.title')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {t('app.tagline')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/books"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center transition-colors flex items-center justify-center gap-2"
                >
                  <BookIcon size={20} />
                  <span>Browse Books</span>
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-center transition-colors"
                >
                  Login / Register
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Library"
                className="rounded-lg shadow-xl w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center transition-transform hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full mb-4">
                <BookIcon size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Extensive Collection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access thousands of books in multiple languages including English, Hindi, and Marathi.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center transition-transform hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 rounded-full mb-4">
                <SearchIcon size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Smart Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find exactly what you're looking for with our advanced search and filter options.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center transition-transform hover:transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 rounded-full mb-4">
                <UsersIcon size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                User Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easily manage your borrowings, view history, and renew books from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Books
            </h2>
            <Link
              to="/books"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start reading?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join our library today and get access to thousands of books in multiple languages.
          </p>
          <Link
            to="/login"
            className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-md font-medium inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
