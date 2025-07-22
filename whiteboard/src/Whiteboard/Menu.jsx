import React, { useState } from "react";
import rectangleIcon from "../resources/icons/rectangle.webp";
import lineIcon from "../resources/icons/line.webp";
import rubberIcon from "../resources/icons/eraser.png";
import textIcon from "../resources/icons/text.jpg";
import selectionIcon from "../resources/icons/selection.jpg";
import ellipseIcon from "../resources/icons/ellipse-shape.webp";
import { tooltype } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { setToolType } from "./whiteboardSlice";
import { useParams , useNavigate} from "react-router-dom";
import "../index.css"
import Toast from "../toast/toast";

const IconButton = ({ src, type }) => {
  const selectedToolType = useSelector((state) => state.whiteboardSlice.tool);
  const dispatch = useDispatch();
  const isActive = selectedToolType === type;

  return (
    <button
      className={isActive ? "menu_button_active" : "menu_button"}
      onClick={() => dispatch(setToolType(type))}
    >
      <img src={src} alt={type} width="75%" height="75%" />
    </button>
  );
};

function Menu({ showShareToast }) {
  const { roomId } = useParams();
  const url = `${window.location.origin}/whiteboard/${roomId}`;
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);

  // Simulate auth: Replace this with actual context or Redux state
  const isLoggedIn = !!localStorage.getItem("authToken");

  const handleShare = async () => {
    if (!isLoggedIn) {
      showShareToast("🚫 Please sign in to use collaboration!");
      return;
    }

    await navigator.clipboard.writeText(url);
    showShareToast("🔗 Link copied to clipboard!");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  return (
    <>
      <div className="menu_container">
        <IconButton src={rectangleIcon} type={tooltype.RECTANGLE} />
        <IconButton src={lineIcon} type={tooltype.LINE} />
        <IconButton src={textIcon} type={tooltype.TEXT} />
        <IconButton src={ellipseIcon} type={tooltype.ELLIPSE} />
        <IconButton src={rubberIcon} type={tooltype.RUBBER} />
        <IconButton src={selectionIcon} type={tooltype.SELECTION} />
      </div>

      <div className="top-right-controls">
        {!isLoggedIn && (
          <button className="top-button signin-btn" onClick={handleSignIn}>
            Sign In
          </button>
        )}
        <button className="top-button share-btn" onClick={handleShare}>
          🔗 Share
        </button>
      </div>
    </>
  );
}

export default Menu;
