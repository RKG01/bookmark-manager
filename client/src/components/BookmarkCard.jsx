import './BookmarkCard.css';
import { bookmarksAPI } from '../services/api';

function BookmarkCard({ bookmark, onEdit, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Delete "${bookmark.title}"?`)) {
      onDelete(bookmark.id);
    }
  };

  const handleVisit = async (e) => {
    e.preventDefault();
    try {
      await bookmarksAPI.trackVisit(bookmark.id);
      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      // Still open the link even if tracking fails
      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bookmark-card">
      <div className="bookmark-icon">
        {bookmark.faviconUrl ? (
          <img 
            src={bookmark.faviconUrl} 
            alt="" 
            className="bookmark-favicon"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span>📁</span>
        )}
      </div>
      <div className="bookmark-content">
        <h3 className="bookmark-title">{bookmark.title}</h3>
        <a 
          href={bookmark.url} 
          onClick={handleVisit}
          className="bookmark-url"
        >
          {bookmark.url}
        </a>
        {bookmark.description && (
          <p className="bookmark-description">{bookmark.description}</p>
        )}
        <div className="bookmark-meta">
          <span className="bookmark-category">
            Category: {bookmark.category?.name || 'Unknown'}
          </span>
          {bookmark.visitCount > 0 && (
            <span className="bookmark-visits">
              👁️ {bookmark.visitCount} {bookmark.visitCount === 1 ? 'visit' : 'visits'}
            </span>
          )}
        </div>
      </div>
      <div className="bookmark-actions">
        <button onClick={() => onEdit(bookmark)} className="btn-edit">
          Edit
        </button>
        <button onClick={handleDelete} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookmarkCard;
