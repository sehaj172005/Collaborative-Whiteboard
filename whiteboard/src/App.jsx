// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Whiteboard from "./Whiteboard/WhiteBoard"
import HomePage from "./Home/Home"
import SignIn from "./Auth/SignIn";
import Signup from "./Auth/Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        {/* 🟩 Support both classic and room-based routes */}
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/whiteboard/:roomId" element={<Whiteboard />} />
      </Routes>
    </Router>
  );
};

export default App;
