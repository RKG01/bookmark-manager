# Bookmark Manager

A full-stack web application for saving, organizing, and managing bookmarks. Built with React frontend and Node.js/Express backend with SQLite database.

## Project Overview

Bookmark Manager allows users to:
- Save website links with title, URL, and description
- Organize bookmarks into categories
- Search bookmarks by title or description
- Filter bookmarks by category
- Track how many times each bookmark is visited
- View favicons for quick visual identification
- Switch between light and dark themes

## Technology Stack

### Frontend
- React 19.2.0
- Vite 7.3.1 (build tool)
- CSS3 (styling)
- Fetch API (HTTP requests)

### Backend
- Node.js
- Express 5.2.1 (web framework)
- SQLite 3 (database)
- better-sqlite3 (SQLite driver)

### Database
- SQLite with 2 tables: categories and bookmarks
- Foreign key constraints for data integrity
- Auto-incrementing IDs

## Project Structure

```
bookmark-manager/
├── client/                          Frontend React application
│   ├── src/
│   │   ├── components/             React components
│   │   │   ├── BookmarkCard.jsx    Display individual bookmark
│   │   │   ├── BookmarkForm.jsx    Form to add/edit bookmark
│   │   │   ├── BookmarkList.jsx    List of bookmarks
│   │   │   ├── CategorySidebar.jsx Left sidebar with categories
│   │   │   ├── SearchBar.jsx       Search and filter controls
│   │   │   └── Modal.jsx           Reusable modal wrapper
│   │   ├── services/
│   │   │   └── api.js              API communication layer
│   │   ├── App.jsx                 Main application component
│   │   ├── App.css                 Application styles
│   │   └── main.jsx                Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                          Backend Express application
│   ├── routes/
│   │   ├── bookmarks.js            Bookmark API endpoints
│   │   ├── categories.js           Category API endpoints
│   │   └── visit.js                Visit tracking endpoint
│   ├── utils/
│   │   ├── database.js             Database initialization
│   │   ├── dataStore.js            Data access layer
│   │   ├── validation.js           Input validation
│   │   └── favicon.js              Favicon utility
│   ├── bookmarks.db                SQLite database file
│   ├── index.js                    Server entry point
│   ├── package.json
│   └── .gitignore
│
├── README.md                        This file
├── RUN_INSTRUCTIONS.md              Detailed setup instructions
├── IMPLEMENTATION_SUMMARY.md        Complete implementation details
├── BONUS_FEATURES.md                Bonus features documentation
└── plan.md                          System design and planning
```

## Features

### Core Features
- Create bookmarks with title, URL, description, and category
- Edit existing bookmarks
- Delete bookmarks with confirmation
- Create and manage categories
- Delete categories (bookmarks move to Uncategorized)
- Search bookmarks by title or description
- Filter bookmarks by category
- Combine search and filter operations
- URL validation
- Data persists between sessions

### Bonus Features
- Favicon fetching: Automatic favicon display for bookmarks
- Dark mode: Toggle between light and dark themes with persistence
- Visit tracking: Track and display how many times each bookmark is visited

## Database Schema

### Categories Table
```
id              INTEGER PRIMARY KEY AUTOINCREMENT
name            TEXT NOT NULL UNIQUE
created_at      TEXT NOT NULL DEFAULT (datetime('now'))
```

### Bookmarks Table
```
id              INTEGER PRIMARY KEY AUTOINCREMENT
title           TEXT NOT NULL
url             TEXT NOT NULL
description     TEXT
category_id     INTEGER NOT NULL (FOREIGN KEY)
favicon_url     TEXT
visit_count     INTEGER NOT NULL DEFAULT 0
last_visited    TEXT
created_at      TEXT NOT NULL DEFAULT (datetime('now'))
updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
```

## API Endpoints

### Bookmarks
- GET /api/bookmarks - Get all bookmarks (supports ?category=id&search=term)
- GET /api/bookmarks/:id - Get single bookmark
- POST /api/bookmarks - Create new bookmark
- PUT /api/bookmarks/:id - Update bookmark
- DELETE /api/bookmarks/:id - Delete bookmark

### Categories
- GET /api/categories - Get all categories with bookmark counts
- POST /api/categories - Create new category
- DELETE /api/categories/:id - Delete category

### Visit Tracking
- POST /api/visit/:id - Track bookmark visit

## Getting Started

### Prerequisites
- Node.js version 16 or higher
- npm (comes with Node.js)
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd bookmark-manager
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

### Running the Application

You need two terminal windows.

**Terminal 1 - Start Backend Server**
```bash
cd server
npm start
```

Expected output:
```
Database seeded with initial data
Server is running on http://localhost:3000
```

**Terminal 2 - Start Frontend Development Server**
```bash
cd client
npm run dev
```

Expected output:
```
VITE v7.3.1  ready in XXX ms

Local:   http://localhost:5173/
```

### Access the Application
Open your web browser and navigate to: http://localhost:5173

## Usage Guide

### Adding a Bookmark
1. Click the "+ Add New" button in the main area
2. Fill in the bookmark details:
   - Title (required)
   - URL (required, must be valid)
   - Description (optional)
   - Category (required)
3. Click "Save Bookmark"
4. The favicon will be fetched automatically

### Searching Bookmarks
1. Type in the search box at the top
2. Results filter automatically (300ms delay)
3. Search works on title and description

### Filtering by Category
1. Click a category in the left sidebar, or
2. Use the category dropdown in the search bar
3. Click "All" to see all bookmarks

### Editing a Bookmark
1. Click "Edit" button on any bookmark card
2. Modify the fields
3. Click "Update Bookmark"

### Deleting a Bookmark
1. Click "Delete" button on any bookmark card
2. Confirm the deletion in the dialog

### Managing Categories
1. To create: Click "+" button in the sidebar
2. Enter category name and click "Save"
3. To delete: Hover over category and click "x"
4. Bookmarks in deleted category move to Uncategorized

### Dark Mode
1. Click the moon/sun icon in the top-right corner
2. Theme preference is saved automatically

### Tracking Visits
1. Click any bookmark URL to open it
2. Visit count increments automatically
3. Visit count displays with eye icon on the card

## Troubleshooting

### Backend won't start
- Check if port 3000 is available
- Verify Node.js is installed: node --version
- Delete bookmarks.db and restart
- Check for error messages in terminal

### Frontend won't start
- Check if port 5173 is available
- Verify Node.js is installed
- Clear node_modules and reinstall: rm -rf node_modules && npm install
- Check for error messages in terminal

### API not connecting
- Ensure backend is running on port 3000
- Check browser console for errors (F12)
- Verify vite.config.js proxy settings

### Database errors
- Delete bookmarks.db file
- Restart backend server
- Database will be recreated with seed data

### Favicons not loading
- Check internet connection
- Favicons use Google's service
- Fallback emoji will display if service unavailable

## Development

### Project Structure Explanation

**Frontend (React)**
- Components are organized by feature
- API service layer handles all backend communication
- State management uses React hooks
- CSS is component-scoped

**Backend (Express)**
- Routes are organized by resource (bookmarks, categories)
- Data access layer abstracts database operations
- Validation happens on both client and server
- Error handling with proper HTTP status codes

**Database (SQLite)**
- Automatic initialization on first run
- Seed data included for testing
- Foreign key constraints ensure data integrity
- Timestamps track creation and updates

### Adding New Features

1. Backend: Add route in server/routes/
2. Backend: Add data access methods in server/utils/dataStore.js
3. Frontend: Add API method in client/src/services/api.js
4. Frontend: Add component or update existing component
5. Test the feature end-to-end

## Performance Considerations

- Search is debounced (300ms) to reduce API calls
- Database queries are optimized with proper WHERE clauses
- Favicons are cached by browser
- Dark mode uses CSS only (no JavaScript overhead)
- Visit tracking uses atomic database updates

## Security Notes

- Backend runs on localhost only
- CORS is enabled for frontend communication
- URLs are validated before storage
- SQL queries use parameterized statements to prevent injection
- No sensitive data is stored

## Limitations

- Single user application (no authentication)
- SQLite is suitable for small to medium datasets
- No pagination (all bookmarks loaded at once)
- No backup system (manual backup required)
- Deletions are permanent

## Future Enhancements

- User authentication and multi-user support
- Bookmark tags in addition to categories
- Import/export functionality
- Drag-and-drop bookmark reordering
- Keyboard shortcuts
- Browser extension
- Mobile application
- Full-text search with indexing
- Bookmark sharing

## Building for Production

### Frontend Build
```bash
cd client
npm run build
```

Output will be in client/dist/ directory.

### Backend Deployment
- Set NODE_ENV=production
- Use a process manager like PM2
- Set up reverse proxy (nginx)
- Enable HTTPS
- Configure environment variables

## Testing

### Manual Testing Checklist
- Create bookmark with valid data
- Create bookmark with invalid URL (should fail)
- Edit existing bookmark
- Delete bookmark
- Search bookmarks
- Filter by category
- Combine search and filter
- Create category
- Delete category
- Toggle dark mode
- Click bookmark to track visit

### API Testing
Use curl or Postman to test endpoints:
```bash
curl http://localhost:3000/api/bookmarks
curl http://localhost:3000/api/categories
curl -X POST http://localhost:3000/api/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","url":"https://test.com","categoryId":1}'
```

## File Descriptions

### Server Files
- index.js: Express app setup, middleware, route mounting
- routes/bookmarks.js: CRUD endpoints for bookmarks
- routes/categories.js: CRUD endpoints for categories
- routes/visit.js: Visit tracking endpoint
- utils/database.js: SQLite initialization and schema
- utils/dataStore.js: Data access layer with SQL queries
- utils/validation.js: Input validation functions
- utils/favicon.js: Favicon URL generation

### Client Files
- App.jsx: Main component with state management
- App.css: Application styles including dark mode
- components/BookmarkCard.jsx: Display individual bookmark
- components/BookmarkForm.jsx: Form for add/edit
- components/BookmarkList.jsx: List container
- components/CategorySidebar.jsx: Category management
- components/SearchBar.jsx: Search and filter
- components/Modal.jsx: Modal wrapper
- services/api.js: API communication layer

## Dependencies

### Backend
- express: Web framework
- cors: Cross-origin resource sharing
- better-sqlite3: SQLite database driver

### Frontend
- react: UI library
- react-dom: React DOM rendering
- vite: Build tool

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the RUN_INSTRUCTIONS.md file
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify all prerequisites are installed

## Summary

Bookmark Manager is a complete full-stack application demonstrating:
- React component architecture
- Express REST API design
- SQLite database management
- State management with hooks
- Form validation
- Error handling
- User interface design
- Dark mode implementation
- Visit tracking
- Favicon integration

The application is production-ready for personal use and can be extended with additional features as needed.
