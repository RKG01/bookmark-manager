const express = require('express');
const router = express.Router();
const { bookmarks } = require('../utils/dataStore');

// POST /api/visit/:id - Track bookmark visit
router.post('/:id', (req, res) => {
  try {
    const bookmarkId = parseInt(req.params.id);
    
    if (isNaN(bookmarkId)) {
      return res.status(400).json({ error: 'Invalid bookmark ID' });
    }

    const bookmark = bookmarks.getById(bookmarkId);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const updated = bookmarks.incrementVisitCount(bookmarkId);
    res.json(updated);
  } catch (error) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ error: 'Failed to track visit' });
  }
});

module.exports = router;
