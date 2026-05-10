import React, { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const {
        access_token,
        email: userEmail,
        role,
        user_id,
        username,
      } = res.data;

      if (!access_token) {
        alert("Authentication failed: No token received");
        return;
      }

      // Store user data
      localStorage.setItem("token", access_token);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("username", username);

      alert(`Welcome back, ${username}!`);
      
      window.location.href = "/";

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err);
      alert(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-viewport">
      <div className="login-split-layout">
        
        {/* Left Side: Branding (Consistent with Signup) */}
        <div className="login-brand-side">
          <div className="brand-overlay">
            <div className="header-divider"></div>
            <p className="tagline">Beyond the Headlines</p>
            
            <div className="login-welcome-msg">
              <h3>Stay Informed.</h3>
              <p>Your trusted news experience awaits. Stay connected to the latest
                stories, insights, and conversations shaping today’s world.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-side">
          <div className="login-box">
            <h2 className="login-title">Welcome Back</h2>

            <form onSubmit={handleLogin} className="actual-login-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label>Password</label>
                  <span className="forgot-pass">Forgot?</span>
                </div>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-pass"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </form>

            <p className="signup-link-text">
              Don't have an account? <Link to="/signup">Create one now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;