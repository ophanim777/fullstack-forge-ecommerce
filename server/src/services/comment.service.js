import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { createNotification } from "./notification.service.js";

export async function createComment(postId, userId, data) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new ApiError(404, "Post tidak ditemukan.");
  }

  // Kalau ini adalah reply, cari komentar induknya
  let parentComment = null;

  if (data.parentId) {
    parentComment = await prisma.comment.findUnique({
      where: {
        id: data.parentId,
      },
    });

    if (!parentComment) {
      throw new ApiError(
        404,
        "Komentar yang ingin dibalas tidak ditemukan."
      );
    }

    // Pastikan komentar induk berasal dari post yang sama
    if (parentComment.postId !== postId) {
      throw new ApiError(
        400,
        "Komentar tidak berasal dari post ini."
      );
    }
  }

  // Buat komentar
  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      userId,
      postId,
      parentId: data.parentId || null,
    },
    include: {
      user: {
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

  // =========================
  // NOTIFICATION
  // =========================

  if (parentComment) {
    // REPLY
    await createNotification({
      userId: parentComment.userId,
      actorId: userId,
      type: "REPLY",
      message: "membalas komentar kamu.",
      postId,
      commentId: comment.id,
    });
  } else {
    // COMMENT
    await createNotification({
      userId: post.authorId,
      actorId: userId,
      type: "COMMENT",
      message: "mengomentari post kamu.",
      postId,
      commentId: comment.id,
    });
  }

  return comment;
}

export async function getComments(postId) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new ApiError(404, "Post tidak ditemukan.");
  }

  return await prisma.comment.findMany({
    where: {
      postId,
      parentId: null,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
        },
      },

      replies: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
}

export async function updateComment(commentId, userId, data) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new ApiError(404, "Komentar tidak ditemukan.");
  }

  if (comment.userId !== userId) {
    throw new ApiError(
      403,
      "Kamu tidak memiliki akses."
    );
  }

  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: data.content,
    },
    include: {
      user: {
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

export async function deleteComment(commentId, userId) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new ApiError(404, "Komentar tidak ditemukan.");
  }

  if (comment.userId !== userId) {
    throw new ApiError(403, "Kamu tidak memiliki akses.");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
}