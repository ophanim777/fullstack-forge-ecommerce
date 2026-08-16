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