import { useState, useEffect } from 'react';
import './BookmarkForm.css';

function BookmarkForm({ bookmark, categories, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    categoryId: categories[0]?.id || 0
  });
  const [errors, setErrors] = useState({});
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (bookmark) {
      setFormData({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description || '',
        categoryId: bookmark.categoryId
      });
    }
  }, [bookmark]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    if (formData.categoryId === undefined || formData.categoryId === null) {
      newErrors.categoryId = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      await onSave(formData);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'categoryId' ? parseInt(value) : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bookmark-form">
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="GitHub"
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="url">URL *</label>
        <input
          type="text"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://github.com"
        />
        {errors.url && <span className="error">{errors.url}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Code hosting and collaboration"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoryId">Category *</label>
        {!isCreatingCategory ? (
          <>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              type="button"
              className="btn-create-category"
              onClick={() => setIsCreatingCategory(true)}
            >
              + Create new category
            </button>
          </>
        ) : (
          <div className="inline-category-form">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setIsCreatingCategory(false);
                setNewCategoryName('');
              }}
            >
              Cancel
            </button>
          </div>
        )}
        {errors.categoryId && <span className="error">{errors.categoryId}</span>}
      </div>

      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-save">
          {bookmark ? 'Update' : 'Save'} Bookmark
        </button>
      </div>
    </form>
  );
}

export default BookmarkForm;
