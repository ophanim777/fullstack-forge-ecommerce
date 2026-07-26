import { prisma } from "../config/prisma.js";

export async function getFeed(userId) {
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
  });

  return posts.map(post => ({
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
  }));
}