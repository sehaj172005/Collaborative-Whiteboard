const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

const mongodb_url = process.env.MONGODB_URL;

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://collaborative-whiteboard-hv0h.onrender.com", // If serving frontend from same backend
  "https://collaborative-whiteboard-1-l20r.onrender.com", // Exact React Frontend URL
  process.env.FRONTEND_URL, // Dynamic exact frontend URL
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Import Routes
const Userroutes = require("./routes/user");
app.use("/user", Userroutes);

// ✅ Room-based whiteboard state
const roomElementsMap = new Map();

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    const elements = roomElementsMap.get(roomId) || [];
    socket.emit("receive-whiteboard-state", elements);
  });

  socket.on("send-element", ({ roomId, element }) => {
    let elements = roomElementsMap.get(roomId) || [];
    const index = elements.findIndex((el) => el.id === element.id);

    if (index === -1) {
      elements.push(element);
    } else {
      elements[index] = element;
    }

    roomElementsMap.set(roomId, elements);
    socket.to(roomId).emit("element-updated", element);
  });

  socket.on("send-whiteboard-state", ({ roomId, elements }) => {
    roomElementsMap.set(roomId, elements);
    socket.to(roomId).emit("receive-whiteboard-state", elements);
  });

  socket.on("disconnect", () => { });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.message);
  res.status(500).json({ error: "Something failed internally." });
});

const PORT = process.env.PORT || 3000;

async function main() {
  await mongoose.connect(mongodb_url, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }).then(() => {
    console.log("✅ Connected to MongoDB");
  })

  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
main();
