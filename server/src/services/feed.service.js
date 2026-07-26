import { prisma } from "../config/prisma.js";

export async function getFeed(userId, page = 1, limit = 10) {

  const skip = (page - 1) * limit;

  // Ambil semua user yang sedang diikuti
  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  });

  const followingIds = following.map(item => item.followingId);

  // Sertakan post milik sendiri
  followingIds.push(userId);

  const total = await prisma.post.count({
  where: {
    authorId: {
      in: followingIds,
    },
  },
});

  // Ambil semua post
  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: followingIds,
      },
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
      likes: true,
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });

  return  {
  total,
  posts: posts.map(post => ({
    id: post.id,
    content: post.content,
    image: post.image,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author,
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
    isLiked: post.likes.some(
      like => like.userId === userId
    ),
  })),
};
};