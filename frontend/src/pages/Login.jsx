import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "./Login.css"; // Import CSS file for styling
import logo from "/oodo_circle_logo.png"; // Replace with your app logo path

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(email, password);
      console.log("Login successful:", response);
      alert("Logged in successfully!");
      // navigate("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup"); // Redirect to sign-up page
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={logo} alt="EcoVibe Logo" className="logo" />
        </div>
        <div className="header-content">
          <h2>Welcome Back</h2>
          <p className="subtitle">
            🌿 Join our sustainable marketplace ecosystem
          </p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="form-input"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="form-input"
            />
          </div>
          <div className="button-group">
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing you in..." : "Sign In"}
            </button>
          </div>
        </form>
        <div className="footer-content">
          <p>
            New to EcoFinds?{" "}
            <span className="signup-link" onClick={handleSignUpRedirect}>
              Join the movement
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
