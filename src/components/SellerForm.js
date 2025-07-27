import React, { useState, useRef, useEffect } from "react";
import { isAuthenticated } from "../utils/auth";
import "../styles/SellerForm.css";

function SellerForm() {
  const [photo, setPhoto] = useState([]);
  const fileInputRef = useRef();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [regulation, setRegulation] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [sellerRollNo, setSellerRollNo] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  React.useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
      return;
    }
    
    // Automatically set the seller roll number from logged-in user
    const userRollNumber = localStorage.getItem('userRollNumber');
    if (userRollNumber) {
      setSellerRollNo(userRollNumber);
    }
  }, []);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 2);
    setPhoto(files);
  };

  const handlePhotoButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    
    const bookData = {
      seller_roll_no: sellerRollNo,
      book_name: title,
      book_year: bookYear,
      subject: subject,
      category: category,
      regulation: regulation,
      book_condition: condition,
      price: parseFloat(price),
      description: description
    };

    try {
      console.log('Submitting book with data:', bookData);
      
      // Import and use the data service
      const { addBook } = await import('../utils/dataService');
      
      const result = await addBook(bookData, photo);
      
      if (result.success) {
        setSuccessMsg("Book listed successfully!");
        setTitle("");
        setSubject("");
        setCategory("");
        setRegulation("");
        setCondition("");
        setPrice("");
        setDescription("");
        setBookYear("");
        setPhoto([]);
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setSuccessMsg("Failed to list book: " + (result.message || 'Unknown error'));
        console.error('Upload failed:', result);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setSuccessMsg("Error saving book: " + err.message);
    }
  };

  return (
    <div className="seller-home-outer">
      <h2 className="seller-title">Sell Your Textbook</h2>
      <p className="seller-subtitle">
        Turn your old textbooks into cash and help fellow students save money on
        their academic resources
      </p>
      <form
        className="seller-card"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="seller-section-header">
          <span role="img" aria-label="info">
            📘
          </span>{" "}
          Book Information
        </div>
        <div className="seller-section-desc">
          Provide detailed information about your textbook to attract potential
          buyers
        </div>
        <div className="seller-photo-section">
          <div className="seller-photo-label">
            <span role="img" aria-label="photo">
              🖼️
            </span>{" "}
            Book Photos <span></span>
          </div>
          <div className="seller-photo-upload-area">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handlePhotoChange}
              multiple
            />
            <div className="seller-photo-upload-box">
              <div className="seller-photo-upload-icon">⬆️</div>
              <div>Upload clear photos of your book</div>
              <div className="seller-photo-upload-hint">
                Include the front cover and any important pages. Max file size
                5MB each.
              </div>
              <button
                type="button"
                className="seller-photo-btn"
                onClick={handlePhotoButtonClick}
              >
                Choose Photos
              </button>
            </div>
            {photo.length > 0 && (
              <div className="seller-photo-preview-box">
                {photo.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`Book ${idx + 1}`}
                    className="seller-photo-thumb"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="seller-form-fields">
          <div className="seller-field">
            <label>Book Title *</label>
            <input
              type="text"
              className="seller-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="seller-form-row">
            <div className="seller-field">
              <label>Subject *</label>
              <input
                type="text"
                className="seller-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="seller-field">
              <label>Category *</label>
              <select
                className="seller-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="CSE">CSE</option>
                <option value="COS">COS</option>
                <option value="CSM">CSM</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="EEE">EEE</option>
              </select>
            </div>
          </div>
          <div className="seller-form-row">
            <div className="seller-field">
              <label>Regulation *</label>
              <select
                className="seller-select"
                value={regulation}
                onChange={(e) => setRegulation(e.target.value)}
                required
              >
                <option value="">Select regulation</option>
                <option value="R20">R20</option>
                <option value="R23">R23</option>
              </select>
            </div>
            <div className="seller-field">
              <label>Book Condition *</label>
              <select
                className="seller-select"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Used">Used</option>
              </select>
            </div>
          </div>
          <div className="seller-form-row">
            <div className="seller-field">
              <label>Book Year *</label>
              <select
                className="seller-select"
                value={bookYear}
                onChange={(e) => setBookYear(e.target.value)}
                required
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div className="seller-field">
              <label>Selling Price (₹) *</label>
              <input
                type="number"
                className="seller-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                required
              />
            </div>
          </div>

          <div className="seller-field">
            <label>Additional Description</label>
            <textarea
              className="seller-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the book's condition, any markings, missing pages, or special features…"
            />
          </div>
        </div>
        <button type="submit" className="seller-submit-btn">
          List Book for Sale
        </button>
        {successMsg && (
          <div
            style={{
              marginTop: "1rem",
              color: successMsg.includes("success") ? "green" : "red",
            }}
          >
            {successMsg}
          </div>
        )}
      </form>
    </div>
  );
}

export default SellerForm;
