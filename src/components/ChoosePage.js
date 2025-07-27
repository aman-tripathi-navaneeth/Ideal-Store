import React from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import "../styles/ChoosePage.css";

function ChoosePage() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
      return;
    }
  }, []);
  return (
    <div className="choose-page">
      <button
        className="my-profile-btn"
        onClick={() => navigate("/my-profile")}
      >
        👤
      </button>
      <h2 className="choose-title">What would you like to do?</h2>
      <div className="choose-options">
        <button className="choose-card buy" onClick={() => navigate("/buy")}>
          <span role="img" aria-label="Buy">
            🛒
          </span>
          <h3>Buy Book</h3>
          <p className="choose-card-desc">Browse books from other students</p>
        </button>
        <button className="choose-card sell" onClick={() => navigate("/sell")}>
          <span role="img" aria-label="Sell">
            🏷️
          </span>
          <h3>Sell Book</h3>
          <p className="choose-card-desc">List your textbooks for sale</p>
        </button>
      </div>
      <div className="choose-info">
        <div className="info-card">
          <span className="info-icon">ℹ️</span>
          <div className="info-content">
            <strong>Note:</strong> To check your current listings or manage your books, 
            please visit your profile by clicking the profile button (👤) above. 
            The "Buy Books" section only shows books from other students - you can't search 
            for your own listings there since you wouldn't want to buy your own books!
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChoosePage;
