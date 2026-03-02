import {
  NOTIFICATION_STATUS,
} from "../constants/index.js";
import { Notification } from "../services/index.js";
import { sendNotificationToUser } from "../socket.io/notification.js";

export const getAll = async (req, res) => {
  const {user_id} = req.params;
  const {page, limit} = req.query;
  const result = await Notification.getAll({user_id, requested_page : page, record_limit : limit});
  return res.status(200).json({ success: true, data : result });
};

export const send = async (req,res) => {
  try {
      const { user_id, message } = req.body;
      const notification = await Notification.create({
          status: NOTIFICATION_STATUS.PENDING,
          send_to: user_id,
          message: message,
        });
        
      const sent = sendNotificationToUser(req.app.get("io"), user_id, message);

      if (!sent) {
        return res.status(404).json({ message: "Notification will be delivered When the user will be active" });
      }
      await Notification.updateStatus(notification._id, NOTIFICATION_STATUS.DELIVERED);
      res.json({ message: "Notification sent successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: `Failed to send notification ${err.message}` });
    }
}