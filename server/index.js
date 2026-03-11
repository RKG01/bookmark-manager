const express = require('express');
const cors = require('cors');
const bookmarksRouter = require('./routes/bookmarks');
const categoriesRouter = require('./routes/categories');
const visitRouter = require('./routes/visit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/visit', visitRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bookmark Manager API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
