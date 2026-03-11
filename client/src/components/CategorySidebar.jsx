import { useState } from 'react';
import './CategorySidebar.css';

function CategorySidebar({ categories, selectedCategory, onSelectCategory, onCreateCategory, onDeleteCategory }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      await onCreateCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsCreating(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (categoryId === 0) return; // Can't delete Uncategorized
    
    if (window.confirm(`Delete "${categoryName}"? Bookmarks will be moved to Uncategorized.`)) {
      try {
        await onDeleteCategory(categoryId);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="category-sidebar">
      <div className="sidebar-header">
        <h3>Categories</h3>
        <button 
          className="btn-add-category"
          onClick={() => setIsCreating(!isCreating)}
          title="Add Category"
        >
          +
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="category-form">
          <input
            type="text"
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            autoFocus
          />
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <button type="submit" className="btn-save">Save</button>
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => {
                setIsCreating(false);
                setNewCategoryName('');
                setError('');
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="category-list">
        <div 
          className={`category-item ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          <span>All</span>
          <span className="category-count">
            {categories.reduce((sum, cat) => sum + cat.bookmarkCount, 0)}
          </span>
        </div>

        {categories.map(category => (
          <div 
            key={category.id}
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
          >
            <span onClick={() => onSelectCategory(category.id)}>
              {category.name}
            </span>
            <div className="category-actions">
              <span className="category-count">{category.bookmarkCount}</span>
              {category.id !== 0 && (
                <button
                  className="btn-delete-category"
                  onClick={() => handleDelete(category.id, category.name)}
                  title="Delete category"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorySidebar;
