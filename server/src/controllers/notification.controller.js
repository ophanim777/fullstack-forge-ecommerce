import {
  getNotifications,
  markNotificationAsRead as markNotificationAsReadService,
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

export async function markNotificationAsRead(
  req,
  res,
  next
) {
  try {
    const notification =
      await markNotificationAsReadService(
        req.params.id,
        req.user.id
      );

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
}