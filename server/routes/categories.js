const express = require('express');
const router = express.Router();
const { readData, writeData, getNextId } = require('../utils/dataStore');
const { validateCategory } = require('../utils/validation');

// GET /api/categories - Get all categories with bookmark counts
router.get('/', (req, res) => {
  try {
    const data = readData();
    
    const categoriesWithCounts = data.categories.map(category => ({
      ...category,
      bookmarkCount: data.bookmarks.filter(b => b.categoryId === category.id).length
    }));

    res.json({ categories: categoriesWithCounts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories - Create new category
router.post('/', (req, res) => {
  try {
    const validation = validateCategory(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const data = readData();
    
    // Check if category name already exists
    const nameExists = data.categories.some(
      cat => cat.name.toLowerCase() === req.body.name.trim().toLowerCase()
    );
    
    if (nameExists) {
      return res.status(400).json({ errors: ['Category name already exists'] });
    }

    const newCategory = {
      id: getNextId(data.categories),
      name: req.body.name.trim(),
      createdAt: new Date().toISOString()
    };

    data.categories.push(newCategory);
    writeData(data);

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    // Prevent deletion of Uncategorized
    if (categoryId === 0) {
      return res.status(400).json({ error: 'Cannot delete Uncategorized category' });
    }

    const data = readData();
    
    const categoryIndex = data.categories.findIndex(c => c.id === categoryId);
    
    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Move all bookmarks in this category to Uncategorized (id: 0)
    data.bookmarks = data.bookmarks.map(bookmark => {
      if (bookmark.categoryId === categoryId) {
        return { ...bookmark, categoryId: 0, updatedAt: new Date().toISOString() };
      }
      return bookmark;
    });

    // Remove the category
    data.categories.splice(categoryIndex, 1);
    writeData(data);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
