import React from "react";
import "./toast.css"

function Toast({ message }) {
  return <div className="toast">{message}</div>;
}

export default Toast;
