import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [roll, setRoll] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [logoError, setLogoError] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (roll.length !== 10) {
      setError("Roll number must be exactly 10 characters long.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Import the authentication function
      const { authenticateUser } = await import('../utils/dataService');
      
      console.log("Attempting login with:", { roll_number: roll });
      
      const result = authenticateUser(roll, password);
      
      if (result.success) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRollNumber", result.user.roll_number);
        navigate("/choose");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(`Login error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <img
            src={`${process.env.PUBLIC_URL}/college-logo.jpeg`}
            alt="College Logo"
            className="auth-logo-img"
            onLoad={() =>
              console.log("College logo loaded successfully on login page")
            }
            onError={(e) => {
              console.error("Failed to load college logo with PUBLIC_URL, trying alternative:", e.target.src);
              // Try alternative path
              if (!e.target.src.includes('/college-logo.jpeg')) {
                e.target.src = "/college-logo.jpeg";
              } else {
                console.error("All attempts failed, college logo not found");
                setLogoError(true);
              }
            }}
          />
          {logoError && (
            <div className="college-logo-fallback" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              border: '3px solid #667eea',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
              IDEAL
            </div>
          )}
        </div>
        <div className="auth-title">IDEAL Bookstore</div>
        <div className="auth-subtitle">Sign in with your Roll Number</div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="auth-label">Roll Number</label>
            <div className="auth-input-row">
              <span className="auth-input-icon">#</span>
              <input
                type="text"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                maxLength={10}
                className="auth-input"
                placeholder="Enter your 10-digit roll number"
                autoFocus
              />
            </div>
            <div className="auth-helper">
              Must be exactly 10 characters long
            </div>
          </div>
          <div>
            <label className="auth-label">Password</label>
            <div className="auth-input-row">
              <span className="auth-input-icon"></span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="Enter your password"
              />
            </div>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="demo-credentials">
          <div className="demo-title">Demo Login Credentials:</div>
          <div className="demo-account">
            <strong>Account 1:</strong> 226K1A0545 | Password: aman123
          </div>
          <div className="demo-account">
            <strong>Account 2:</strong> 216K1A0503 | Password: aman123
          </div>
        </div>
        <div className="auth-link-row">
          Don't have an account?
          <button
            className="auth-link-btn"
            type="button"
            onClick={() => navigate("/register")}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
