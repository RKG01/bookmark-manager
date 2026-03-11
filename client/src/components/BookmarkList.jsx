import BookmarkCard from './BookmarkCard';
import './BookmarkList.css';

function BookmarkList({ bookmarks, onEdit, onDelete, onAddNew }) {
  if (bookmarks.length === 0) {
    return (
      <div className="bookmark-list">
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No bookmarks found</h3>
          <p>Start by adding your first bookmark</p>
          <button onClick={onAddNew} className="btn-add-first">
            + Add Bookmark
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmark-list">
      <div className="bookmark-list-header">
        <h2>Bookmarks ({bookmarks.length})</h2>
        <button onClick={onAddNew} className="btn-add-new">
          + Add New
        </button>
      </div>
      <div className="bookmark-grid">
        {bookmarks.map(bookmark => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default BookmarkList;
