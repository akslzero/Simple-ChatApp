require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const db = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const friendRoutes = require("./routes/friendRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/messages", messageRoutes);

// Store online users
// change: map userId -> Set of socketIds to support multiple tabs
const onlineUsers = new Map();
// expose io + onlineUsers to controllers via app
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Helper to add a socket for a user
  const addOnline = (userId, sid) => {
    const key = String(userId);
    if (!onlineUsers.has(key)) onlineUsers.set(key, new Set());
    onlineUsers.get(key).add(sid);
    app.set("onlineUsers", onlineUsers); // keep app value updated
  };

  const removeOnlineBySocket = (sid) => {
    for (const [userId, sockets] of onlineUsers.entries()) {
      if (sockets.has(sid)) {
        sockets.delete(sid);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          io.emit("userOffline", userId);
        }
        app.set("onlineUsers", onlineUsers);
        return;
      }
    }
  };

  // Handle user authentication
  socket.on("authenticate", (userId) => {
    if (!userId) return;
    addOnline(userId, socket.id);
    console.log(`User ${userId} authenticated (socket ${socket.id})`);

    // Send current online list to the connected socket
    socket.emit("onlineUsers", Array.from(onlineUsers.keys()).map(Number));

    // Notify others that this user is online (only when first socket joined)
    const sockets = onlineUsers.get(String(userId));
    if (sockets && sockets.size === 1) {
      io.emit("userOnline", Number(userId));
    }
  });

  // Handle sending messages
  socket.on("sendMessage", async (data) => {
    const { recipientId, content, senderId } = data;

    try {
      // Save message to database
      const [result] = await db.query(
        "INSERT INTO messages (sender_id, recipient_id, content) VALUES (?, ?, ?)",
        [senderId, recipientId, content]
      );

      const message = {
        id: result.insertId,
        senderId,
        recipientId,
        content,
        timestamp: new Date(),
      };

      // Send to recipient if online (send to all recipient sockets)
      const recipientSockets = onlineUsers.get(String(recipientId));
      if (recipientSockets) {
        for (const sid of recipientSockets) {
          io.to(sid).emit("message", message);
        }
      }

      // Send back to sender (ack on the socket that sent it)
      socket.emit("message", message);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle typing indicator
  socket.on("typing", (data) => {
    const { recipientId, isTyping } = data;
    const recipientSockets = onlineUsers.get(String(recipientId));

    if (recipientSockets) {
      for (const sid of recipientSockets) {
        io.to(sid).emit("typing", {
          userId: data.userId,
          isTyping,
        });
      }
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    removeOnlineBySocket(socket.id);
  });
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "ChatApp Backend API is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server ready for connections`);
});
