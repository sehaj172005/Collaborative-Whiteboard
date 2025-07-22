import React, { useState } from "react";
import "./Signup.css"; // Reuse your existing styles
import { useNavigate } from "react-router-dom";

const Toast = ({ message, onClose }) => (
  <div className="custom-toast">
    {message}
    <button className="custom-toast-close" onClick={onClose}>
      ×
    </button>
  </div>
);

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // Clear any old errors

    try {
      const response = await fetch("http://localhost:3000/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      // Store token for authenticated requests
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Extract user's name—your backend should send it as data.name
      // Fallback to email if name is not available
      const userName = data.name
        ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
        : email.split("@")[0];

      setToastMessage(
        `Welcome, ${userName}! Redirecting you to your whiteboard...`
      );
      setShowToast(true);

      // Redirect after toast shows for 1.7s (or let user close early)
      setTimeout(() => {
        setShowToast(false);
        navigate("/whiteboard");
      }, 1700);
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  // Manual close for toast (optional)
  const handleToastClose = () => {
    setShowToast(false);
    navigate("/whiteboard");
  };

  return (
    <div className="signup-root">
      {showToast && <Toast message={toastMessage} onClose={handleToastClose} />}
      <div className="signup-left">
        <div className="signup-brand">Collaborative Whiteboard</div>
        <div className="signup-info">
          <h1>Design + Collaboration, all in Collaborative Whiteboard</h1>
          <p>
            A virtual center for designers, devs, PMs, and all teams to perform
            their duties in unison. At least 200% faster with Collaborative
            Whiteboard.
          </p>
        </div>
        <div className="signup-copyright">
          © 2024 Collaborative Whiteboard. All rights reserved.
          <br />
          <a href="#">Privacy Policy</a> &nbsp;
          <a href="#">Terms of Service</a>
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-card">
          <h2 className="signup-heading">Sign in</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="signup-error">{error}</div>
            <button className="signup-btn" type="submit">
              Sign in
            </button>
          </form>
          <div className="signup-alt">
            Don't have an account? <a href="/signup">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
