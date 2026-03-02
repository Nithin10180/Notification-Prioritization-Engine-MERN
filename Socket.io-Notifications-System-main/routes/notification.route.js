import express from "express";
import { errorHandler } from "../middlewares/index.js";
import { NotificationController } from "../controllers/index.js";

const router = new express.Router();
router.get("/:user_id", errorHandler(NotificationController.getAll));
router.post("/send", errorHandler(NotificationController.send));

export const NotificationRoutes = router;
