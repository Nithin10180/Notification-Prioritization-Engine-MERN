import { log } from "node:console";
import { NOTIFICATION_STATUS } from "../constants/index.js";
import { Notification } from "../services/index.js";

const userSockets = new Map();

export const registerNotificationSocket = async (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    
    socket.on("register_user", async (userId) => {
      userSockets.set(userId, socket.id);
  
      const notifications = await Notification.getUserPending(userId);
      notifications.forEach(async (notification) => {
        socket.emit(`notification_${userId}`, { message: notification.message });
        await Notification.updateStatus(notification._id, NOTIFICATION_STATUS.DELIVERED);
      });
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of userSockets.entries()) {
        if (id === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

export const sendNotificationToUser = (io, userId, message) => {
  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(socketId).emit(`notification_${userId}`, { message });
    return true;
  }
  return false;
};
