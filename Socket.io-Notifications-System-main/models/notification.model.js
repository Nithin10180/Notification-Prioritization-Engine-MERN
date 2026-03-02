import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {

    status: {
      type: String,
      enum: ["pending", "delivered"],
      default: "pending",
    },
    send_to: {
      // a unique key associated with every user e.g user_id
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const NotificationModel = mongoose.model("notification", NotificationSchema);
