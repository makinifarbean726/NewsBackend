import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-main">
      <div className="footer-container">
        {/* LEFT SECTION */}
        <div className="footer-section">
          <h3 className="footer-logo">Nation<span>Scope</span></h3>
          <p className="footer-motto">Beyond the Headlines</p>
          <p className="footer-text">
            Your daily source of breaking news, features, and stories across the continent.
          </p>
        </div>

        {/* CENTER LINKS */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-list">
            <li><a href="/home" className="footer-link">Home</a></li>
            <li><a href="/login" className="footer-link">Login</a></li>
          </ul>
        </div>

        {/* RIGHT INFO */}
        <div className="footer-section">
          <h4 className="footer-heading">Contact: 07xxxxxxxx</h4>
          <p className="footer-text">Email: support@nationscope.com</p>
          <p className="footer-text">Location: Eldoret, Kenya</p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <div className="footer-accent-line"></div>
        <p>© {new Date().getFullYear()} NationScope News. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;