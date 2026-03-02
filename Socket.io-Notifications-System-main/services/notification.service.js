import {NotificationModel} from "../models/index.js";

export class Notification {
  static async getAll({user_id, requested_page, record_limit}) {
    const page = parseInt(requested_page, 10) || 1;
    const limit = parseInt(record_limit) || 10;
    const skip = (page - 1) * limit;
    const notifications = await NotificationModel.find({ send_to: user_id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const totalDocuments = await NotificationModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    return {
      page,
      limit,
      totalDocuments,
      totalPages,
      notifications
  };
  }
  static async create(payload) {
    const notification = await NotificationModel.create(payload);
    if (!notification) {
      throw new Error("Failed to create notification");
    }
    const detailed_notification = await Notification.getById(notification._id)
    return detailed_notification;
  }

  static async getById(id) {
    const notification = await NotificationModel.findById(id);
      if (!notification) {
        throw new Error("Notification not found");
      }
      return notification;
  }

  static async updateStatus(id, status) {
    return NotificationModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  static async getByUserId(user_id) {
    const notifications = await NotificationModel.find({ send_to: user_id });
    return notifications;
  }

  static async getUserPending(user_id){
    const notifications = await NotificationModel.find({ send_to: user_id, status: "pending" });
    return notifications;
  }
}