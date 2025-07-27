import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

function AppContent() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setHeaderVisible(true);
      }
      // Hide header when scrolling down and not at the top
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Smooth scroll function
  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Navigation handlers
  const handleHomeClick = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    smoothScrollTo("how-it-works");
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    smoothScrollTo("contact");
  };

  const handleLearnMoreClick = (e) => {
    e.preventDefault();
    smoothScrollTo("why");
  };

  // New: handle navigation to choose page
  const handleChooseNav = (e) => {
    e.preventDefault();
    navigate("/login");
  };



  return (
    <div className="App">
      {/* Header with College Logo */}
      <header className={`header ${!headerVisible ? "header-hidden" : ""}`}>
        <div className="header-container">
          <div className="logo-section">
            {!logoError ? (
              <img
                src={`${process.env.PUBLIC_URL}/college-logo.jpeg`}
                alt="College Logo"
                className="college-logo"
                onLoad={() => {
                  console.log("College logo loaded successfully on home page");
                }}
                onError={(e) => {
                  console.error("Failed to load college logo on home page, trying alternative:", e.target.src);
                  // Try alternative path
                  if (!e.target.src.includes('/college-logo.jpeg')) {
                    e.target.src = "/college-logo.jpeg";
                  } else {
                    console.error("All attempts failed, college logo not found on home page");
                    setLogoError(true);
                  }
                }}
              />
            ) : (
              <div className="college-logo-fallback" style={{
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                IDEAL
              </div>
            )}
            <h1 className="site-title">Ideal Bookstore</h1>
          </div>
          <nav className="nav-menu">
            <a href="#home" className="nav-link" onClick={handleHomeClick}>
              Home
            </a>
            <a href="/choose" className="nav-link" onClick={handleChooseNav}>
              Buy Books
            </a>
            <a href="/choose" className="nav-link" onClick={handleChooseNav}>
              Sell Books
            </a>
            <a href="#about" className="nav-link" onClick={handleAboutClick}>
              About
            </a>
            <a
              href="#contact"
              className="nav-link"
              onClick={handleContactClick}
            >
              Contact
            </a>
          </nav>

        </div>
      </header>

      {/* Hero Section with College Building Background */}
      <section className="hero-section" id="home">
        <div className="hero-background">
          <img
            src="/college-building.png"
            alt="College Building"
            className="college-building-bg"
            onLoad={() =>
              console.log("College building image loaded successfully")
            }
            onError={(e) => {
              console.error("Failed to load college building image");
              e.target.style.display = "none";
            }}
            style={{
              opacity: 1,
              visibility: "visible",
              display: "block",
            }}
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h2 className="hero-title">
            Ideal Institute
            <br />
            of Technology
          </h2>
          <p className="hero-desc">
            Welcome to the bookstore of Ideal Institute Technology – a platform
            where you can buy and sell books directly from your fellow college
            mates at more affordable prices
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleChooseNav}>
              Join
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleLearnMoreClick}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Why Should You Use Our Website Section */}
      <section className="why-section" id="why">
        <div className="container">
          <h2 className="section-title">Why Should You Use Our Website?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Affordable Prices</h3>
              <p className="feature-description">
                Get textbooks at student-friendly prices, often 50-70% cheaper
                than retail stores. Save money while getting the same quality
                education materials.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Buy & Sell Platform</h3>
              <p className="feature-description">
                The same person can be both buyer and seller. Turn your old
                books into cash for new ones, creating a sustainable cycle of
                knowledge sharing.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3 className="feature-title">Campus Community</h3>
              <p className="feature-description">
                Connect with fellow students. Buy from someone who just finished
                the course you're starting. Build meaningful connections within
                your academic community.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">Wide Selection</h3>
              <p className="feature-description">
                Find textbooks for all courses, from freshman year to graduate
                studies. Comprehensive collection covering every academic
                discipline and level.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Quick & Easy</h3>
              <p className="feature-description">
                Simple listing process with instant uploads. Meet on campus for
                easy pickup and payment. No complicated shipping or waiting
                periods.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3 className="feature-title">Eco-Friendly</h3>
              <p className="feature-description">
                Reduce waste by reusing textbooks. Give books a second life on
                campus while contributing to environmental sustainability and
                reducing your carbon footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>List Your Books</h3>
              <p>Upload photos and details of textbooks you want to sell</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Browse & Buy</h3>
              <p>Search for textbooks you need by course or ISBN</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Meet & Exchange</h3>
              <p>Arrange to meet on campus for pickup and payment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Ideal Bookstore</h3>
              <p>Making textbooks affordable for every student.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#buy">Buy Books</a>
              <a href="#sell">Sell Books</a>
              <a href="#about">About Us</a>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@idealbookstore.com</p>
              <p>Campus Location: Student Center</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Ideal Bookstore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppContent;