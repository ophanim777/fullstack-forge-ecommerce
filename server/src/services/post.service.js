import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";

export async function createPost(userId, data) {
  return await prisma.post.create({
    data: {
      content: data.content,
      authorId: userId,
    },
    include: {
      author: {
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

export async function getAllPosts(userId) {
  return await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
        },
      },

      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          comments: true,
  },
},
    },
  }).then((posts) =>
    posts.map((post) => ({
      ...post,

      likesCount: post.likes.length,

      commentsCount: post._count.comments,

      isLiked: post.likes.some(
        (like) => like.userId === userId
      ),

      likes: undefined,
      _count: undefined,
    }))
  );
}

export async function getPostById(id) {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: {
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

  if (!post) {
    throw new ApiError(404, "Post tidak ditemukan.");
  }

  return post;
}


export async function updatePost(postId, userId, data) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new ApiError(404, "Post tidak ditemukan.");
  }

  if (post.authorId !== userId) {
    throw new ApiError(403, "Kamu tidak memiliki akses.");
  }

  return await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      content: data.content,
    },
    include: {
      author: {
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

export async function deletePost(postId, userId) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new ApiError(404, "Post tidak ditemukan.");
  }

  if (post.authorId !== userId) {
    throw new ApiError(403, "Kamu tidak memiliki akses.");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
}


export async function toggleLike(postId, userId) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new ApiError(404, "Post tidak ditemukan.");
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return {
      liked: false,
    };
  }

  await prisma.like.create({
    data: {
      userId,
      postId,
    },
  });

  return {
    liked: true,
  };
}