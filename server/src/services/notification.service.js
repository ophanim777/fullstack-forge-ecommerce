import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";

export async function createNotification({
  userId,
  actorId,
  type,
  message,
  postId = null,
  commentId = null,
}) {
  // Jangan membuat notifikasi untuk diri sendiri
  if (userId === actorId) {
    return null;
  }

  return await prisma.notification.create({
    data: {
      userId,
      actorId,
      type,
      message,
      postId,
      commentId,
    },
    include: {
      actor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
}

export async function getNotifications(userId) {
  return await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      actor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
        },
      },
      post: {
        select: {
          id: true,
          content: true,
        },
      },
      comment: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });
}

export async function markNotificationAsRead(
  notificationId,
  userId
) {
  const notification = await prisma.notification.findUnique({
    where: {
      id: notificationId,
    },
  });

  if (!notification) {
    throw new ApiError(
      404,
      "Notifikasi tidak ditemukan."
    );
  }

  if (notification.userId !== userId) {
    throw new ApiError(
      403,
      "Kamu tidak memiliki akses."
    );
  }

  return await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });
}