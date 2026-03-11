import { useState, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, onCategoryFilter, categories, selectedCategory }) {
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, onSearch]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search bookmarks..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="search-input"
      />
      <select
        value={selectedCategory || ''}
        onChange={(e) => onCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
        className="category-filter"
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
    </div>
  );
}

export default SearchBar;
