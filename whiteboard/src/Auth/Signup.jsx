import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

// Reusable toast component
const Toast = ({ message, onClose }) => (
  <div className="custom-toast">
    {message}
    <button className="custom-toast-close" onClick={onClose}>
      ×
    </button>
  </div>
);

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "User already exists") {
          setToastMessage("⚠️ User already exists. Try signing in instead.");
          setShowToast(true);
        }
        setError(data.message || "Signup failed.");
        return;
      }

      // ✅ Show success message
      setToastMessage("Signup successful! Redirecting you to sign in...");
      setShowToast(true);

      // ✅ Navigate after short delay
      setTimeout(() => {
        setToastMessage("");
        setShowToast(false);
        navigate("/signin");
      }, 3000);
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleToastClose = () => {
    setShowToast(false);
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
          <h2 className="signup-heading">Create your account</h2>
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
              placeholder="Password (6–20 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* 🟣 Password note here */}
            <p className="password-info">
              Password must contain at least one uppercase letter, one lowercase
              letter, one digit, and one special character
            </p>

            <div className="signup-error">{error}</div>
            <button className="signup-btn" type="submit">
              Create account
            </button>
          </form>

          <div className="signup-alt">
            Already have an account? <a href="/signin">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
