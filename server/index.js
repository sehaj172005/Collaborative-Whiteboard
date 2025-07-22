const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const mongoose = require('mongoose');

const mongodb_url = process.env.MONGODB_URL;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

// Import Routes
const Userroutes = require("./routes/user");
app.use("/user", Userroutes);

// ✅ Room-based whiteboard state
const roomElementsMap = new Map();

io.on("connection", (socket) => {
  console.log(`[+] Connected: ${socket.id}`);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);

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

  socket.on("disconnect", () => {
    console.log(`[-] Disconnected: ${socket.id}`);
  });
});


const PORT = process.env.PORT || 3000;

async function main() {
  await mongoose.connect(mongodb_url).then(() => {
    console.log("✅ Connected to MongoDB");
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
main();
