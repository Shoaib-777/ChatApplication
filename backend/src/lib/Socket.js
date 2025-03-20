import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../Models/User.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});
const userSocketMap = {}; // {userId: socketId}
const groupSocketMap = {}; // { groupId: [socketIds] }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function getGroupSocketIds(groupId) {
  return groupSocketMap[groupId] || [];
}

// used to store online users

io.on("connection", async(socket) => {
  // console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    await User.findByIdAndUpdate(userId,{status:"online",new:true})
  }
  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Join a group chat
  socket.on("joinGroup", ({ groupId }) => {
    if (!groupSocketMap[groupId]) {
      groupSocketMap[groupId] = [];
    }

    if (!groupSocketMap[groupId].includes(socket.id)) {
      groupSocketMap[groupId].push(socket.id);
    }

    socket.join(groupId);
    // console.log(`User ${socket.id} joined group ${groupId}`);
  });

  // Leave a group chat
  socket.on("leaveGroup", ({ groupId }) => {
    if (groupSocketMap[groupId]) {
      groupSocketMap[groupId] = groupSocketMap[groupId].filter(id => id !== socket.id);
      socket.leave(groupId);
      // console.log(`User ${socket.id} left group ${groupId}`);
    }
  });

  socket.on("disconnect", async() => {
    // console.log("A user disconnected", socket.id);
    await User.findByIdAndUpdate(userId,{status:"offline",lastSeen:Date.now(),new:true});
    delete userSocketMap[userId]

    // Remove user from all groups they were in
    Object.keys(groupSocketMap).forEach(groupId => {
      groupSocketMap[groupId] = groupSocketMap[groupId].filter(id => id !== socket.id);
    });
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };