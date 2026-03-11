const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../bookmarks.db');
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initDatabase() {
  // Create categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create bookmarks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT,
      category_id INTEGER NOT NULL,
      favicon_url TEXT,
      visit_count INTEGER NOT NULL DEFAULT 0,
      last_visited TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Check if we need to seed data
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  
  if (categoryCount.count === 0) {
    seedDatabase();
  }
}

// Seed initial data
function seedDatabase() {
  const insertCategory = db.prepare('INSERT INTO categories (id, name, created_at) VALUES (?, ?, ?)');
  const insertBookmark = db.prepare(`
    INSERT INTO bookmarks (title, url, description, category_id, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const seedTransaction = db.transaction(() => {
    // Insert categories
    insertCategory.run(0, 'Uncategorized', '2025-12-11T10:00:00Z');
    insertCategory.run(1, 'Development', '2025-12-11T10:00:00Z');
    insertCategory.run(2, 'Design', '2025-12-11T10:00:00Z');
    insertCategory.run(3, 'News', '2025-12-11T10:00:00Z');

    // Insert bookmarks
    insertBookmark.run(
      'GitHub',
      'https://github.com',
      'Code hosting and collaboration',
      1,
      '2025-12-11T10:30:00Z',
      '2025-12-11T10:30:00Z'
    );
    insertBookmark.run(
      'Dribbble',
      'https://dribbble.com',
      'Design inspiration',
      2,
      '2025-12-11T10:35:00Z',
      '2025-12-11T10:35:00Z'
    );
  });

  seedTransaction();
  console.log('Database seeded with initial data');
}

// Initialize on module load
initDatabase();

module.exports = db;
