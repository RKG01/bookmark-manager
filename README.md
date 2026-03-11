# Bookmark Manager

A simple web application to save, organize, and manage bookmarks.

## Quick Start

### Prerequisites
- Node.js 16+ (download from https://nodejs.org/)
- npm (comes with Node.js)

### Installation

1. Install backend packages:
```bash
cd server
npm install
```

2. Install frontend packages:
```bash
cd client
npm install
```

### Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Expected: `Server is running on http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Expected: `Local: http://localhost:5173/`

Open browser: http://localhost:5173

## Tech Stack

- Frontend: React 19 + Vite
- Backend: Express.js
- Database: SQLite
- Styling: CSS3

## Features

### Core Features
- Add bookmarks (title, URL, description, category)
- Edit and delete bookmarks
- Create and manage categories
- Search bookmarks by title or description
- Filter bookmarks by category
- Data persists in SQLite database

### Bonus Features
- Dark mode toggle
- Automatic favicon display
- Visit tracking (count how many times you click a bookmark)

## Project Structure

```
bookmark-manager/
├── server/                 Backend (Express + SQLite)
│   ├── routes/            API endpoints
│   ├── utils/             Database and validation
│   └── index.js           Server entry point
├── client/                Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    React components
│   │   ├── services/      API calls
│   │   └── App.jsx        Main component
│   └── package.json
└── README.md
```

## API Endpoints

### Bookmarks
- `GET /api/bookmarks` - Get all bookmarks
- `POST /api/bookmarks` - Create bookmark
- `PUT /api/bookmarks/:id` - Update bookmark
- `DELETE /api/bookmarks/:id` - Delete bookmark

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `DELETE /api/categories/:id` - Delete category

### Visits
- `POST /api/visit/:id` - Track bookmark visit

## Database

SQLite database with 2 tables:

**Categories**
- id, name, created_at

**Bookmarks**
- id, title, url, description, category_id, favicon_url, visit_count, last_visited, created_at, updated_at

## Usage

1. **Add Bookmark:** Click "+ Add New" button
2. **Search:** Type in search box (searches title and description)
3. **Filter:** Click category in sidebar or use dropdown
4. **Edit:** Click "Edit" on any bookmark
5. **Delete:** Click "Delete" on any bookmark
6. **Dark Mode:** Click moon icon in header
7. **Track Visits:** Click bookmark URL to open and track visit

## Troubleshooting

**Port 3000 already in use?**
- Change port in server/index.js

**Port 5173 already in use?**
- Vite will suggest alternative port

**npm install fails?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database errors?**
```bash
cd server
rm bookmarks.db
npm start
```

## Available Commands

**Backend:**
- `npm start` - Start server
- `npm install` - Install packages

**Frontend:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## File Descriptions

### Backend Files
- `server/index.js` - Express app setup
- `server/routes/bookmarks.js` - Bookmark endpoints
- `server/routes/categories.js` - Category endpoints
- `server/routes/visit.js` - Visit tracking
- `server/utils/database.js` - Database initialization
- `server/utils/dataStore.js` - Database queries
- `server/utils/validation.js` - Input validation
- `server/utils/favicon.js` - Favicon utility

### Frontend Files
- `client/src/App.jsx` - Main component
- `client/src/components/BookmarkCard.jsx` - Bookmark display
- `client/src/components/BookmarkForm.jsx` - Add/edit form
- `client/src/components/BookmarkList.jsx` - Bookmarks list
- `client/src/components/CategorySidebar.jsx` - Categories
- `client/src/components/SearchBar.jsx` - Search and filter
- `client/src/components/Modal.jsx` - Modal wrapper
- `client/src/services/api.js` - API calls

## Dependencies

### Backend
- **express** - Web framework
- **cors** - Enable cross-origin requests
- **better-sqlite3** - SQLite database

### Frontend
- **react** - UI library
- **react-dom** - React rendering
- **vite** - Build tool

## Features Explained

### Search
- Type in search box
- Searches title and description
- Results update automatically (300ms delay)

### Filter
- Click category in sidebar
- Or use dropdown in search bar
- Combine with search for advanced filtering

### Dark Mode
- Click moon icon in header
- Preference saves automatically
- Works on all pages

### Favicon
- Automatically fetched when creating bookmark
- Uses Google's favicon service
- Falls back to emoji if unavailable

### Visit Tracking
- Click any bookmark URL
- Visit count increments
- Shows with eye icon on card

## Limitations

- Single user (no authentication)
- SQLite (suitable for small datasets)
- No pagination
- No backup system

## Future Enhancements

- User authentication
- Bookmark tags
- Import/export
- Drag-and-drop reordering
- Keyboard shortcuts
- Browser extension

## Support

For issues:
1. Check error messages in terminal
2. Check browser console (F12)
3. Verify both servers are running
4. Try restarting services

## License

MIT

## Summary

Bookmark Manager is a full-stack application with:
- React frontend
- Express backend
- SQLite database
- Dark mode
- Favicon display
- Visit tracking

Perfect for learning full-stack development or personal bookmark management.
