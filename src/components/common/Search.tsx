import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Search as SearchIcon, Filter, X } from 'lucide-react';

interface SearchProps {
  onSearch: (query: string, filters: Record<string, string>) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({
    genre: '',
    language: '',
    author: '',
    year: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      language: '',
      author: '',
      year: ''
    });
  };

  const genres = ['Fiction', 'Non-fiction', 'Science', 'History', 'Biography', 'Fantasy'];
  const languages = ['English', 'Hindi', 'Marathi', 'Spanish', 'French'];

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors">
      <form onSubmit={handleSearch}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={t('search.filter')}
          >
            <Filter size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {t('search.button')}
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-750 animate-fadeIn">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700 dark:text-gray-200">{t('search.filter')}</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1"
              >
                <X size={14} />
                Clear filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('search.genre')}
                </label>
                <select
                  id="genre"
                  value={filters.genre}
                  onChange={(e) => updateFilter('genre', e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('search.language')}
                </label>
                <select
                  id="language"
                  value={filters.language}
                  onChange={(e) => updateFilter('language', e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Languages</option>
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('search.author')}
                </label>
                <input
                  type="text"
                  id="author"
                  value={filters.author}
                  onChange={(e) => updateFilter('author', e.target.value)}
                  placeholder="Author name"
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('search.year')}
                </label>
                <input
                  type="number"
                  id="year"
                  value={filters.year}
                  onChange={(e) => updateFilter('year', e.target.value)}
                  placeholder="Publication year"
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;