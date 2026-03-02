# 🚀 Socket.io Notifications System  
Real-time notification delivery with persistent storage & unread state tracking.

This project implements a **real-time notification system** using **Node.js**, **Express**, and **Socket.io**, with notifications stored in a **MongoDB** so the user can still retrieve notifications even when offline.  

It supports:
- ✅ User → Socket mapping  
- ✅ Real-time delivery  
- ✅ Pending / Delivere tracking  
- ✅ Persistent notification history  
- ✅ Works across multiple browser tabs & devices  


Notifications are:
1. Stored in DB  
2. Delivered instantly **if the user is online**  
3. Delivered later when the user reconnects  

---

## 📦 Installation & Setup

```bash
git clone https://github.com/nomanaslam1696/Socket.io-Notifications-System.git
cd Socket.io-Notifications-System
npm install
```

Create .env file
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notifications
```
Start Server
```
npm run dev
```

🌐 API Endpoints

1) Send Notification
Endpoint to send a notification to a specific user.
```
POST /api/notifications/send
```
Body
```
{
  "user_id": "USER_ID",
  "message": "Your order #12345 has been confirmed."
}
```
Response
```
{
  "success": true,
  "message": "Notification sent and stored."
}
```
2) Get User Notifications
Fetch stored notifications (delivered/pending).
```
GET /api/notifications/:user_id
```

Response
```
[
  {
    "id": "abc123",
    "title": "Order Placed!",
    "message": "Your order #12345 has been confirmed.",
    "is_read": false,
    "timestamp": "2025-10-30T12:00:00Z"
  }
]
```

🧠 Core Logic Highlights
Store user socket connections
```
const userSockets = new Map();
```
When user connects
```
socket.on("register_user", (userId) => {
  userSockets.set(userId, socket.id);
});
```
Send real-time notification if online
```
if (userSockets.has(receiver_id)) {
  io.to(userSockets.get(receiver_id)).emit("send_notification", notification);
}
```
Always store in DB
```
await NotificationModel.create(notificationData);
```
🏁 Client Side Example
```
import io from "socket.io-client";
const socket = io("http://localhost:3000");

socket.emit("register_user", USER_ID);

socket.on("send_notification", (data) => {
  console.log("🔔 New Notification:", data);
});
```
🧪 Testing the System
Open two browser windows

Login with two different user IDs

Trigger notification using POST API

Watch real-time delivery 💨

📌 Key Benefits
Works even when user reconnects later 🌙

Notifications are always stored 🗄️

Real-time updates without refreshing 🔁

Lightweight & scalable ⚡


👨‍💻 Author

Noman Aslam

Node.js Backend Developer.
