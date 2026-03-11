const express = require('express');
const router = express.Router();
const { bookmarks, categories } = require('../utils/dataStore');
const { validateBookmark } = require('../utils/validation');
const { getFaviconUrl } = require('../utils/favicon');

// GET /api/bookmarks - Get all bookmarks with optional filtering
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    
    const filters = {};
    if (category) {
      const categoryId = parseInt(category);
      if (!isNaN(categoryId)) {
        filters.categoryId = categoryId;
      }
    }
    if (search && search.trim()) {
      filters.search = search.trim();
    }

    const allBookmarks = bookmarks.getAll(filters);
    res.json({ bookmarks: allBookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// GET /api/bookmarks/:id - Get single bookmark
router.get('/:id', (req, res) => {
  try {
    const bookmarkId = parseInt(req.params.id);
    
    if (isNaN(bookmarkId)) {
      return res.status(400).json({ error: 'Invalid bookmark ID' });
    }

    const bookmark = bookmarks.getById(bookmarkId);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.json(bookmark);
  } catch (error) {
    console.error('Error fetching bookmark:', error);
    res.status(500).json({ error: 'Failed to fetch bookmark' });
  }
});

// POST /api/bookmarks - Create new bookmark
router.post('/', (req, res) => {
  try {
    const validation = validateBookmark(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Verify category exists
    if (!categories.exists(req.body.categoryId)) {
      return res.status(400).json({ errors: ['Category does not exist'] });
    }

    const bookmarkData = {
      title: req.body.title.trim(),
      url: req.body.url.trim(),
      description: req.body.description ? req.body.description.trim() : '',
      categoryId: req.body.categoryId,
      faviconUrl: getFaviconUrl(req.body.url.trim())
    };

    const newBookmark = bookmarks.create(bookmarkData);
    res.status(201).json(newBookmark);
  } catch (error) {
    console.error('Error creating bookmark:', error);
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
});

// PUT /api/bookmarks/:id - Update bookmark
router.put('/:id', (req, res) => {
  try {
    const bookmarkId = parseInt(req.params.id);
    
    if (isNaN(bookmarkId)) {
      return res.status(400).json({ error: 'Invalid bookmark ID' });
    }

    const validation = validateBookmark(req.body, true);
    
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const existingBookmark = bookmarks.getById(bookmarkId);
    if (!existingBookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Verify category exists if provided
    if (req.body.categoryId !== undefined && !categories.exists(req.body.categoryId)) {
      return res.status(400).json({ errors: ['Category does not exist'] });
    }

    const updateData = {};
    if (req.body.title) updateData.title = req.body.title.trim();
    if (req.body.url) updateData.url = req.body.url.trim();
    if (req.body.description !== undefined) updateData.description = req.body.description.trim();
    if (req.body.categoryId !== undefined) updateData.categoryId = req.body.categoryId;

    const updatedBookmark = bookmarks.update(bookmarkId, updateData);
    res.json(updatedBookmark);
  } catch (error) {
    console.error('Error updating bookmark:', error);
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

// DELETE /api/bookmarks/:id - Delete bookmark
router.delete('/:id', (req, res) => {
  try {
    const bookmarkId = parseInt(req.params.id);
    
    if (isNaN(bookmarkId)) {
      return res.status(400).json({ error: 'Invalid bookmark ID' });
    }

    const deleted = bookmarks.delete(bookmarkId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

module.exports = router;
