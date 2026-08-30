import { prisma } from "../config/prisma.js";

export async function getFeed(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  });

  const followingIds = [
    ...following.map((item) => item.followingId),
    userId,
  ];

  // Kondisi post yang masuk feed
  const where = {
    authorId: {
      in: followingIds,
    },
  };

  const total = await prisma.post.count({
    where,
  });

  const posts = await prisma.post.findMany({
    where,

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
        where: {
          userId,
        },
        select: {
          userId: true,
        },
      },

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    skip,
    take: limit,
  });

  return {
    total,

    page,

    limit,

    totalPages: Math.ceil(total / limit),

    posts: posts.map((post) => ({
      id: post.id,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,

      author: post.author,

      likesCount: post._count.likes,

      commentsCount: post._count.comments,

      isLiked: post.likes.length > 0,
    })),
  };
}