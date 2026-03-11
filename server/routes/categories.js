const express = require('express');
const router = express.Router();
const { categories } = require('../utils/dataStore');
const { validateCategory } = require('../utils/validation');

// GET /api/categories - Get all categories with bookmark counts
router.get('/', (req, res) => {
  try {
    const allCategories = categories.getAll();
    res.json({ categories: allCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
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

    const name = req.body.name.trim();
    
    // Check if category name already exists
    if (categories.nameExists(name)) {
      return res.status(400).json({ errors: ['Category name already exists'] });
    }

    const newCategory = categories.create(name);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
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

    if (!categories.exists(categoryId)) {
      return res.status(404).json({ error: 'Category not found' });
    }

    categories.delete(categoryId);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
