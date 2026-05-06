import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ns-footer">
      <div className="footer-content">
        
        {/* BRAND COLUMN */}
        <div className="footer-column brand-info">
          <h2 className="footer-logo" onClick={() => navigate('/')}>
            Nation<span>Scope</span>
          </h2>
          <p className="footer-tagline">
            Delivering deep-dive journalism and real-time reports from across the nation.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="mailto:contact@nationscope.com" aria-label="Email">
              <i className="fas fa-envelope"></i>
            </a>
            <a href="tel:+1234567890" aria-label="Phone">
              <i className="fas fa-phone-alt"></i>
            </a>
          </div>
        </div>

        {/* NAVIGATION COLUMN */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li onClick={() => navigate('/')}>Home</li>
            <li onClick={() => navigate('/search?q=latest')}>Latest News</li>
            <li onClick={() => navigate('/categories')}>Browse Topics</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        {/* SUPPORT COLUMN */}
        <div className="footer-column">
          <h3>Help & Support</h3>
          <ul>
            <li>Contact Editors</li>
            <li>Press Room</li>
            <li>Privacy Policy</li>
            <li>Advertising</li>
          </ul>
        </div>

        {/* NEWSLETTER/EDITABLE SECTION */}
        <div className="footer-column newsletter">
          <h3>Stay Informed</h3>
          <p>Join our newsletter for weekly deep-dives.</p>
          <div className="footer-input-group">
            <input type="email" placeholder="Email address" />
            <button className="footer-btn">Join</button>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} NationScope News Media. All rights reserved.</p>
        <div className="footer-accent-line"></div>
      </div>
    </footer>
  );
};

export default Footer;