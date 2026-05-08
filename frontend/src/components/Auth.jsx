import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="auth-wrapper">
      {/* THEMED CIRCLE BUTTON */}
      <button 
        className={`auth-circle-btn ${isOpen ? "active" : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Account Menu"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="auth-svg-icon"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>

      {/* THEMED DROPDOWN */}
      {isOpen && (
        <div className="auth-dropdown">
          <div className="auth-content">
            <h3>Welcome</h3>
            <p>Log in to your account or join NationScope today.</p>
            
            <div className="auth-actions">
              <button 
                className="btn-login" 
                onClick={() => handleRedirect("/login")}
              >
                Log In
              </button>
              
              <div className="divider">
                <span>or</span>
              </div>

              <button 
                className="btn-signup" 
                onClick={() => handleRedirect("/signup")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Auth;