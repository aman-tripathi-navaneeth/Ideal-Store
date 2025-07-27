import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    roll: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [logoError, setLogoError] = React.useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("Registration is currently disabled. Please use the demo accounts provided on the login page.");
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
              console.log("College logo loaded successfully on register page")
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
              fontSize: '1.5rem',
              fontWeight: 'bold',
              border: '3px solid #667eea',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
              IDEAL
            </div>
          )}
        </div>
        <div className="auth-title">Create your account</div>
        <div className="auth-subtitle">
          Join thousands of students buying and selling books
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="auth-label">Roll Number</label>
            <div className="auth-input-row">
              <span className="auth-input-icon">#</span>
              <input
                type="text"
                name="roll"
                value={form.roll}
                onChange={handleChange}
                maxLength={10}
                className="auth-input"
                placeholder="Your 10-digit roll number"
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="auth-label">Name</label>
            <div className="auth-input-row">
              <span className="auth-input-icon">👤</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="auth-input"
                placeholder="Your full name"
                required
              />
            </div>
          </div>
          <div>
            <label className="auth-label">Password</label>
            <div className="auth-input-row">
              <span className="auth-input-icon">🔒</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="auth-input"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <label className="auth-label">Confirm Password</label>
            <div className="auth-input-row">
              <span className="auth-input-icon">🔒</span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="auth-input"
                placeholder="Confirm Password"
              />
            </div>
          </div>
          {error && <div className="auth-error">{error}</div>}
          {success && (
            <div className="auth-success">
              🎉 You have successfully registered! Welcome to IDEAL Bookstore.
              <br />
              Redirecting you to the main page...
            </div>
          )}
          <button type="submit" className="auth-btn" disabled={loading || success}>
            {loading ? "Creating Account..." : success ? "Registration Successful!" : "Create Account"}
          </button>
        </form>
        <div className="auth-link-row">
          Already have an account?
          <button
            className="auth-link-btn"
            type="button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;