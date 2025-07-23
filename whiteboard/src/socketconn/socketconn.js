// socketconn/socketconn.js
import { io } from "socket.io-client";
import { store } from "../store/store";
import { setElement, updateElements } from "../Whiteboard/whiteboardSlice";

let socket;
let roomIdGlobal;

export const Socketconnfunction = (roomId) => {
  roomIdGlobal = roomId;

  if (!socket || !socket.connected) {
    socket = io("https://collaborative-whiteboard-hv0h.onrender.com");

    socket.on("connect", () => {
      console.log(`🟢 Connected with socket id ${socket.id}`);
      socket.emit("join-room", roomIdGlobal);
    });

    socket.on("receive-whiteboard-state", (newElements) => {
      console.log("🔄 Received full whiteboard:", newElements);
      store.dispatch(setElement(newElements));
    });

    socket.on("element-updated", (element) => {
      store.dispatch(updateElements(element));
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
