// socketconn/socketconn.js
import { io } from "socket.io-client";
import { store } from "../store/store";
import { setElement, updateElements } from "../Whiteboard/whiteboardSlice";

let socket;
let roomIdGlobal;

export const Socketconnfunction = (roomId) => {
  roomIdGlobal = roomId;

  if (!socket || !socket.connected) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    socket = io(apiUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      socket.emit("join-room", roomIdGlobal);
    });

    socket.on("receive-whiteboard-state", (newElements) => {
      store.dispatch(setElement(newElements));
    });

    socket.on("element-updated", (element) => {
      store.dispatch(updateElements(element));
    });

    socket.on("connect_error", () => {
      // silently handle connection errors — UI will keep working offline
    });
  }
};

export const Emitupdatefuction = (element) => {
  if (socket && socket.connected && roomIdGlobal) {
    socket.emit("send-element", { roomId: roomIdGlobal, element });
  }
};

export const CurrentStateEmit = (elements) => {
  if (socket && socket.connected && roomIdGlobal) {
    socket.emit("send-whiteboard-state", { roomId: roomIdGlobal, elements });
  }
};
