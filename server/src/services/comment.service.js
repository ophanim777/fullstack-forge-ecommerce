import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";

export async function createComment(postId, userId, data) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new ApiError(404, "Post tidak ditemukan.");
  }

  return await prisma.comment.create({
    data: {
      content: data.content,
      userId,
      postId,
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