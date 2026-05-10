import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
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
            Nation<span>Scope</span>News
          </h2>
          <p className="footer-tagline">
            Catch up with the latest developments, trending discussions,
            and live updates happening around you right now.
          </p>
          <div className="social-links">
            <a
              href="https://www.facebook.com/share/1DbnczVPCS/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="social-item"
            >
              <FaFacebookF />
              <span>Facebook</span>
            </a>
              <p>nationscopenewsafrica@gmail.com</p>
              <p>+254 717 315077</p>

          </div>
        </div>

        {/* SUPPORT COLUMN */}
        <div className="footer-contact">
          <h4>Head Office</h4>
          <p>Kapsoya, Eldoret</p>
          <p>Kenya</p>
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