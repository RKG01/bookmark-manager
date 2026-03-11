import { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import CategorySidebar from './components/CategorySidebar';
import BookmarkList from './components/BookmarkList';
import Modal from './components/Modal';
import BookmarkForm from './components/BookmarkForm';
import { bookmarksAPI, categoriesAPI } from './services/api';
import './App.css';

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data.categories);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    try {
      const data = await bookmarksAPI.getAll(selectedCategory, searchQuery);
      setBookmarks(data.bookmarks);
      setError('');
    } catch (err) {
      setError('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Bookmark handlers
  const handleSaveBookmark = async (bookmarkData) => {
    try {
      if (editingBookmark) {
        await bookmarksAPI.update(editingBookmark.id, bookmarkData);
      } else {
        await bookmarksAPI.create(bookmarkData);
      }
      await fetchBookmarks();
      await fetchCategories();
      setIsModalOpen(false);
      setEditingBookmark(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteBookmark = async (id) => {
    try {
      await bookmarksAPI.delete(id);
      await fetchBookmarks();
      await fetchCategories();
    } catch (err) {
      alert('Failed to delete bookmark');
    }
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingBookmark(null);
    setIsModalOpen(true);
  };

  // Category handlers
  const handleCreateCategory = async (name) => {
    try {
      await categoriesAPI.create({ name });
      await fetchCategories();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoriesAPI.delete(id);
      await fetchCategories();
      await fetchBookmarks();
    } catch (err) {
      throw err;
    }
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Bookmark Manager</h1>
        <button 
          className="btn-dark-mode" 
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <SearchBar
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        categories={categories}
        selectedCategory={selectedCategory}
      />

      <div className="app-content">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onCreateCategory={handleCreateCategory}
          onDeleteCategory={handleDeleteCategory}
        />

        <main className="app-main">
          {error && <div className="error-banner">{error}</div>}
          <BookmarkList
            bookmarks={bookmarks}
            onEdit={handleEditBookmark}
            onDelete={handleDeleteBookmark}
            onAddNew={handleAddNew}
          />
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBookmark(null);
        }}
        title={editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
      >
        <BookmarkForm
          bookmark={editingBookmark}
          categories={categories}
          onSave={handleSaveBookmark}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingBookmark(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default App;
