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
        <img src={logo} alt="App Logo" className="logo" />
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <span className="signup-link" onClick={handleSignUpRedirect}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
