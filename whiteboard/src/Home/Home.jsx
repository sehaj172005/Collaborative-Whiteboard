import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import downloads from "../resources/icons/download.jpeg"

function HomePage() {
  return (
    <div className="home-root">
      <nav className="home-navbar">
        <span className="home-brand">Collaborative Whiteboard</span>
        <div>
          <Link className="home-nav-btn" to="/signin">Sign In</Link>
          <Link className="home-nav-btn" to="/signup">Sign Up</Link>
        </div>
      </nav>
      <main className="home-main-card">
        <h1 className="home-title">
          Design + Collaboration,<br />all in Collaborative Whiteboard
        </h1>
        <p className="home-desc">
          Real time collaboration with your friends, teammates made easy.
        </p>
        <Link className="home-go-btn" to="/whiteboard">Go to Whiteboard</Link>
        <div className="home-image-placeholder">
          <img src= {downloads} alt="placeholder" />
        </div>
      </main>
    </div>
  );
}

export default HomePage;

