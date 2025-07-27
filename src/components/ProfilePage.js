import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const { rollNumber } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    fetchUserProfile();
    fetchUserBooks();
  }, [rollNumber, navigate]);

  const fetchUserProfile = async () => {
    try {
      console.log('Fetching profile for roll number:', rollNumber);
      const { getUserProfile } = await import('../utils/dataService');
      const data = getUserProfile(rollNumber);
      console.log('Profile data:', data);
      
      if (data.success) {
        setProfile(data.user);
      } else {
        setError(data.message || 'User not found');
      }
    } catch (err) {
      setError('Failed to load user profile');
      console.error('Profile fetch error:', err);
    }
  };

  const fetchUserBooks = async () => {
    try {
      const { getUserBooks } = await import('../utils/dataService');
      const books = getUserBooks(rollNumber);
      setUserBooks(books || []);
    } catch (err) {
      console.error('User books fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBrowse = () => {
    navigate('/buy');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>❌ {error}</h2>
          <button className="back-btn" onClick={handleBackToBrowse}>
            ← Back to Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-btn" onClick={handleBackToBrowse}>
          ← Back to Browse Books
        </button>
        <h1 className="profile-title">Seller Profile</h1>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : rollNumber.charAt(0)}
            </div>
          </div>
          
          <div className="profile-info">
            <h2 className="profile-name">
              {profile?.name || 'Anonymous User'}
            </h2>
            <p className="profile-roll">
              <strong>Roll Number:</strong> {rollNumber}
            </p>
            <p className="profile-member-since">
              <strong>Member since:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>

        <div className="profile-books-section">
          <h3 className="books-section-title">
            📚 Books for Sale ({userBooks.length})
          </h3>
          
          {userBooks.length > 0 ? (
            <div className="profile-books-grid">
              {userBooks.map((book) => (
                <div className="profile-book-card" key={book.id}>
                  <div className="profile-book-image">
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
                    <div className="no-image-placeholder" style={{ display: (book.images && book.images.length > 0) ? 'none' : 'flex' }}>
                      📖
                    </div>
                  </div>
                  
                  <div className="profile-book-info">
                    <h4 className="profile-book-title">{book.book_name}</h4>
                    <p className="profile-book-details">
                      {book.regulation} • {book.category} • {book.book_year}
                    </p>
                    <p className="profile-book-condition">
                      Condition: {book.book_condition}
                    </p>
                    <p className="profile-book-price">₹{book.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-books-message">
              <p>📭 This user hasn't listed any books for sale yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;