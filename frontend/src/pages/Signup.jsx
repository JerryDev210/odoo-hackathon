import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "./Login.css"; // Import CSS file for styling
import logo from "/oodo_circle_logo.png"; // Replace with your app logo path

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username,
        email,
        password
      };
      
      const response = await authService.register(userData);
      console.log("Registration successful:", response);
      alert("Account created successfully!");
      navigate("/login"); // Redirect to login after successful signup
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="EcoVibe Logo" className="logo" />
        <h2>Join EcoFinds</h2>
        <p style={{ color: '#7F8C8D', fontSize: '14px', marginBottom: '24px', marginTop: '-16px' }}>
          🌱 Start your sustainable shopping journey today
        </p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength="6"
          />
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            minLength="6"
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creating your account..." : "Join the Movement"}
          </button>
        </form>
        <p>
          Already part of EcoFinds?{" "}
          <span className="signup-link" onClick={handleLoginRedirect}>
            Sign in here
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
