import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import '../styles/MyProfilePage.css';

function MyProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const userRollNumber = localStorage.getItem('userRollNumber');
    if (userRollNumber) {
      fetchMyProfile(userRollNumber);
      fetchMyBooks(userRollNumber);
    } else {
      setError('User session not found');
      setLoading(false);
    }
  }, [navigate]);

  const fetchMyProfile = async (rollNumber) => {
    try {
      const { getUserProfile } = await import('../utils/dataService');
      const data = getUserProfile(rollNumber);
      
      if (data.success) {
        setProfile(data.user);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    }
  };

  const fetchMyBooks = async (rollNumber) => {
    try {
      console.log('Fetching books for roll number:', rollNumber);
      const { getUserBooks } = await import('../utils/dataService');
      const books = getUserBooks(rollNumber);
      console.log('My books data:', books);
      
      setMyBooks(books || []);
      console.log('Books set in state:', books);
    } catch (err) {
      console.error('My books fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book listing?')) {
      return;
    }

    setDeleteLoading(bookId);
    
    try {
      const { deleteBook } = await import('../utils/dataService');
      const result = deleteBook(bookId, localStorage.getItem('userRollNumber'));
      
      if (result.success) {
        // Remove the book from the local state
        setMyBooks(myBooks.filter(book => book.id !== bookId));
        alert('Book listing deleted successfully!');
      } else {
        alert('Failed to delete book: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete book. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleBackToChoose = () => {
    navigate('/choose');
  };

  const handleSellNewBook = () => {
    navigate('/sell');
  };

  if (loading) {
    return (
      <div className="my-profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-profile-page">
        <div className="profile-error">
          <h2>❌ {error}</h2>
          <button className="back-btn" onClick={handleBackToChoose}>
            ← Back to Main Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-profile-page">
      <div className="my-profile-header">
        <button className="back-btn" onClick={handleBackToChoose}>
          ← Back to Main Menu
        </button>
        <h1 className="my-profile-title">My Profile</h1>
        <button className="sell-new-btn" onClick={handleSellNewBook}>
          + Sell New Book
        </button>
      </div>

      <div className="my-profile-container">
        <div className="my-profile-card">
          <div className="my-profile-avatar">
            <div className="my-avatar-circle">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : profile?.roll_number?.charAt(0) || 'U'}
            </div>
          </div>
          
          <div className="my-profile-info">
            <h2 className="my-profile-name">
              {profile?.name || 'Student'}
            </h2>
            <p className="my-profile-roll">
              <strong>Roll Number:</strong> {profile?.roll_number}
            </p>
            <p className="my-profile-stats">
              <strong>Books Listed:</strong> {myBooks.length}
            </p>
            <p className="my-profile-member-since">
              <strong>Member since:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>

        <div className="my-books-section">
          <h3 className="my-books-section-title">
            📚 My Book Listings ({myBooks.length})
          </h3>
          
          {myBooks.length > 0 ? (
            <div className="my-books-grid">
              {myBooks.map((book) => (
                <div className="my-book-card" key={book.id}>
                  <div className="my-book-image">
                    {book.images && book.images.length > 0 ? (
                      <img
                        src={book.images[0].data}
                        alt={book.book_name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="my-no-image-placeholder" style={{ display: (book.images && book.images.length > 0) ? 'none' : 'flex' }}>
                      📖
                    </div>
                  </div>
                  
                  <div className="my-book-info">
                    <h4 className="my-book-title">{book.book_name}</h4>
                    <p className="my-book-details">
                      {book.regulation} • {book.category} • {book.book_year}
                    </p>
                    <p className="my-book-condition">
                      Condition: {book.book_condition}
                    </p>
                    <p className="my-book-price">₹{book.price}</p>
                    <p className="my-book-date">
                      Listed: {new Date(book.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="my-book-actions">
                    <button 
                      className="delete-book-btn"
                      onClick={() => handleDeleteBook(book.id)}
                      disabled={deleteLoading === book.id}
                    >
                      {deleteLoading === book.id ? '🔄 Deleting...' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-my-books-message">
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No books listed yet</h3>
                <p>You haven't listed any books for sale. Start selling your textbooks to help fellow students!</p>
                <button className="sell-first-book-btn" onClick={handleSellNewBook}>
                  📚 List Your First Book
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;