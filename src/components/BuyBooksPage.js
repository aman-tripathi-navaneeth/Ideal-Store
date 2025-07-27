import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import "../styles/BuyBooksPage.css";

function BuyBooksPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [regulation, setRegulation] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch books from localStorage
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);

    const userRollNumber = localStorage.getItem("userRollNumber");

    // Import and use the data service
    import('../utils/dataService').then(({ getBooksExceptUser }) => {
      const otherUsersBooks = getBooksExceptUser(userRollNumber);
      console.log("Books from other users:", otherUsersBooks.length);
      console.log("Your roll number:", userRollNumber);

      setBooks(otherUsersBooks);
      setFilteredBooks(otherUsersBooks);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching books:", error);
      setLoading(false);
    });
  }, []);

  // Filtering logic
  const handleSearch = () => {
    let filtered = books;
    if (search.trim()) {
      filtered = filtered.filter((book) =>
        book.book_name.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    if (regulation) {
      filtered = filtered.filter((book) => book.regulation === regulation);
    }
    if (branch) {
      filtered = filtered.filter(
        (book) => book.subject === branch || book.category === branch
      );
    }
    if (year) {
      filtered = filtered.filter((book) => {
        // Accept both string and number for year
        return (
          book.book_year === year ||
          book.book_year === parseInt(year) ||
          (book.year && book.year === year)
        );
      });
    }
    setFilteredBooks(filtered);
  };

  // Clear filters
  const handleClear = () => {
    setSearch("");
    setRegulation("");
    setBranch("");
    setYear("");
    setFilteredBooks(books);
  };

  // Handle image click to open modal
  const handleImageClick = (imageUrl, bookName) => {
    setSelectedImage({ url: imageUrl, title: bookName });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  // Handle modal background click
  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Handle book card click to navigate to seller profile
  const handleBookCardClick = (sellerRollNo) => {
    navigate(`/profile/${sellerRollNo}`);
  };

  return (
    <div className="buy-books-page">
      <h2 className="buy-title">Buy Books</h2>
      <p className="buy-subtitle">
        Find the perfect textbooks for your studies at great prices
      </p>
      <div className="buy-filters">
        <input
          type="text"
          className="buy-filter-input"
          placeholder="Search by book name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="buy-filter-select"
          value={regulation}
          onChange={(e) => setRegulation(e.target.value)}
        >
          <option value="">Regulation</option>
          <option value="R20">R20</option>
          <option value="R23">R23</option>
        </select>
        <select
          className="buy-filter-select"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">Branch</option>
          <option value="CSE">CSE</option>
          <option value="CSM">CSM</option>
          <option value="COS">COS</option>
          <option value="ECE">ECE</option>
          <option value="MECH">MECH</option>
          <option value="EEE">EEE</option>
        </select>
        <select
          className="buy-filter-select"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Year</option>
          <option value="First Year">First Year</option>
          <option value="Second Year">Second Year</option>
          <option value="Third Year">Third Year</option>
          <option value="Fourth Year">Fourth Year</option>
        </select>
        <button className="buy-filter-clear" onClick={handleClear}>
          Clear Filters
        </button>
        <button className="buy-filter-search" onClick={handleSearch}>
          Search
        </button>
      </div>
      {loading ? (
        <div className="buy-books-list-empty">
          <div className="buy-books-empty-title">Loading books...</div>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="buy-books-list-result">
          {filteredBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <div
                className="book-content clickable-content"
                onClick={() => handleBookCardClick(book.seller_roll_no)}
                style={{ cursor: "pointer" }}
              >
                <div className="book-title">{book.book_name}</div>
                <div className="book-details">
                  <div className="book-detail-line">
                    <strong>Regulation:</strong> {book.regulation} |{" "}
                    <strong>Branch:</strong> {book.category || "N/A"} |{" "}
                    <strong>Year:</strong> {book.book_year}
                  </div>
                  <div className="book-detail-line">
                    <strong>Seller Roll Number:</strong> {book.seller_roll_no}
                    <span className="profile-hint">
                      👤 Click to view seller profile
                    </span>
                  </div>
                  <div className="book-detail-line">
                    <strong>Condition:</strong> {book.book_condition}
                  </div>
                  <div className="price-highlight">Price: ₹{book.price}</div>
                </div>
              </div>
              <div className="book-image-container">
                {book.images && book.images.length > 0 ? (
                  <>
                    <img
                      src={book.images[0].data}
                      alt={book.book_name}
                      className="book-image"
                      onClick={() =>
                        handleImageClick(
                          book.images[0].data,
                          book.book_name
                        )
                      }
                      onError={(e) => {
                        console.error(
                          "Failed to load thumbnail for book:",
                          book.book_name
                        );
                        e.target.style.display = "none";
                      }}
                    />
                    <div
                      className="no-image-placeholder"
                      style={{ display: "none" }}
                    >
                      📚 No Image
                    </div>
                  </>
                ) : (
                  <div className="no-image-placeholder">📚 No Image</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="buy-books-list-empty">
          <div className="buy-books-empty-icon">📚</div>
          <div className="buy-books-empty-title">No books found</div>
          <div className="buy-books-empty-desc">
            No books are currently listed for sale.
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showModal && selectedImage && (
        <div className="image-modal" onClick={handleModalClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="modal-image"
              onError={(e) => {
                console.error("Failed to load image:", selectedImage.url);
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+";
              }}
            />
            <div className="modal-title">{selectedImage.title}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyBooksPage;
