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