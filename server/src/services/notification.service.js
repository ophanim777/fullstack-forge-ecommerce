import { prisma } from "../config/prisma.js";

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