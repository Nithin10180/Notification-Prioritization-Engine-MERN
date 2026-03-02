import { API_PREFIX } from '../constants/index.js'
import { NotificationRoutes } from "./notification.route.js"

export const registerApi = (app) => {
    app.use(`${API_PREFIX}/notification`, NotificationRoutes)
}