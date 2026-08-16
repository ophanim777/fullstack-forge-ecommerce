import {
  getNotifications,
} from "../services/notification.service.js";

export async function getUserNotifications(
  req,
  res,
  next
) {
  try {
    const notifications = await getNotifications(
      req.user.id
    );

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
}