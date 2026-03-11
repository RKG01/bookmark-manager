const db = require('./database');

// Categories
const categoriesStore = {
  getAll: () => {
    const categories = db.prepare(`
      SELECT 
        c.id,
        c.name,
        c.created_at as createdAt,
        COUNT(b.id) as bookmarkCount
      FROM categories c
      LEFT JOIN bookmarks b ON c.id = b.category_id
      GROUP BY c.id
      ORDER BY c.id
    `).all();
    return categories;
  },

  getById: (id) => {
    return db.prepare('SELECT id, name, created_at as createdAt FROM categories WHERE id = ?').get(id);
  },

  create: (name) => {
    const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
    return categoriesStore.getById(result.lastInsertRowid);
  },

  delete: (id) => {
    // Move bookmarks to Uncategorized (id: 0)
    db.prepare('UPDATE bookmarks SET category_id = 0, updated_at = datetime("now") WHERE category_id = ?').run(id);
    // Delete category
    const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return result.changes > 0;
  },

  exists: (id) => {
    const result = db.prepare('SELECT COUNT(*) as count FROM categories WHERE id = ?').get(id);
    return result.count > 0;
  },

  nameExists: (name, excludeId = null) => {
    let query = 'SELECT COUNT(*) as count FROM categories WHERE LOWER(name) = LOWER(?)';
    let params = [name];
    
    if (excludeId !== null) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const result = db.prepare(query).get(...params);
    return result.count > 0;
  }
};

// Bookmarks
const bookmarksStore = {
  getAll: (filters = {}) => {
    let query = `
      SELECT 
        b.id,
        b.title,
        b.url,
        b.description,
        b.category_id as categoryId,
        b.favicon_url as faviconUrl,
        b.visit_count as visitCount,
        b.last_visited as lastVisited,
        b.created_at as createdAt,
        b.updated_at as updatedAt,
        c.id as 'category.id',
        c.name as 'category.name'
      FROM bookmarks b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by category
    if (filters.categoryId !== undefined && filters.categoryId !== null) {
      query += ' AND b.category_id = ?';
      params.push(filters.categoryId);
    }

    // Search by title or description
    if (filters.search) {
      query += ' AND (LOWER(b.title) LIKE LOWER(?) OR LOWER(b.description) LIKE LOWER(?))';
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern);
    }

    query += ' ORDER BY b.created_at DESC';

    const bookmarks = db.prepare(query).all(...params);
    
    // Transform flat result to nested structure
    return bookmarks.map(row => ({
      id: row.id,
      title: row.title,
      url: row.url,
      description: row.description,
      categoryId: row.categoryId,
      faviconUrl: row.faviconUrl,
      visitCount: row.visitCount,
      lastVisited: row.lastVisited,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: row['category.id'] ? {
        id: row['category.id'],
        name: row['category.name']
      } : null
    }));
  },

  getById: (id) => {
    const row = db.prepare(`
      SELECT 
        b.id,
        b.title,
        b.url,
        b.description,
        b.category_id as categoryId,
        b.favicon_url as faviconUrl,
        b.visit_count as visitCount,
        b.last_visited as lastVisited,
        b.created_at as createdAt,
        b.updated_at as updatedAt,
        c.id as 'category.id',
        c.name as 'category.name'
      FROM bookmarks b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `).get(id);

    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      url: row.url,
      description: row.description,
      categoryId: row.categoryId,
      faviconUrl: row.faviconUrl,
      visitCount: row.visitCount,
      lastVisited: row.lastVisited,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: row['category.id'] ? {
        id: row['category.id'],
        name: row['category.name']
      } : null
    };
  },

  incrementVisitCount: (id) => {
    db.prepare(`
      UPDATE bookmarks 
      SET visit_count = visit_count + 1,
          last_visited = datetime('now')
      WHERE id = ?
    `).run(id);
    return bookmarksStore.getById(id);
  },

  create: (bookmark) => {
    const result = db.prepare(`
      INSERT INTO bookmarks (title, url, description, category_id, favicon_url)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      bookmark.title, 
      bookmark.url, 
      bookmark.description || '', 
      bookmark.categoryId,
      bookmark.faviconUrl || null
    );
    
    return bookmarksStore.getById(result.lastInsertRowid);
  },

  update: (id, bookmark) => {
    const updates = [];
    const params = [];

    if (bookmark.title !== undefined) {
      updates.push('title = ?');
      params.push(bookmark.title);
    }
    if (bookmark.url !== undefined) {
      updates.push('url = ?');
      params.push(bookmark.url);
    }
    if (bookmark.description !== undefined) {
      updates.push('description = ?');
      params.push(bookmark.description);
    }
    if (bookmark.categoryId !== undefined) {
      updates.push('category_id = ?');
      params.push(bookmark.categoryId);
    }

    updates.push('updated_at = datetime("now")');
    params.push(id);

    const query = `UPDATE bookmarks SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...params);
    
    return bookmarksStore.getById(id);
  },

  delete: (id) => {
    const result = db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

module.exports = {
  categories: categoriesStore,
  bookmarks: bookmarksStore
};
