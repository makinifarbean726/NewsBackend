import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // New field
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for validation messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error when user starts typing again
    if (error) setError("");
  };

  // Frontend Validation Logic
  const validateForm = () => {
    const { password, confirmPassword } = formData;

    // 1. Check if passwords match
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    // 2. Length check (> 6)
    if (password.length <= 6) {
      return "Password must be longer than 6 characters.";
    }

    // 3. One uppercase, one lowercase, and one number/special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*[!@#$%^&*])/.test(password);
    if (!regex) {
      return "Password requires at least one uppercase letter, one lowercase letter, and one number or symbol.";
    }

    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Check custom validations
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      alert("Welcome to NationScope! Your account is ready.");
      navigate("/login");
    } catch (err) {
      console.error("SIGNUP ERROR:", err.response?.data || err);
      setError(err?.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-signup-viewport">
      <div className="signup-split-layout">
        
        <div className="signup-brand-side">
          <div className="brand-overlay">
            <p className="tagline">Beyond the Headlines</p>
            <div className="welcome-text">
              <h3>Join the Community</h3>
              <p>Get personalized news, and join the conversation on the topics that matter most.</p>
            </div>
            <div className="brand-accent-lines">
              <div className="accent-red"></div>
              <div className="accent-blue"></div>
            </div>
          </div>
        </div>

        <div className="signup-form-side">
          <div className="form-content-box">
            <h2 className="form-title">Create your account</h2>
            <p className="form-subtitle">Start your journey with Nation Scope News today.</p>

            {/* Error Display */}
            {error && <p className="error-msg">{error}</p>}

            <form onSubmit={handleSignup} className="actual-form">
              <div className="input-group">
                <label>Username</label>
                <input
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Verify Password Input */}
              <div className="input-group">
                <label>Verify Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Joining..." : "Join"}
              </button>
            </form>

            <p className="redirect-text">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;