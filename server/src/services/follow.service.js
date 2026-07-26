import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";

export async function toggleFollow(targetUserId, currentUserId) {
  if (targetUserId === currentUserId) {
    throw new ApiError(400, "Tidak dapat mengikuti akun sendiri.");
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: targetUserId,
    },
  });

  if (!targetUser) {
    throw new ApiError(404, "User tidak ditemukan.");
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    return {
      following: false,
    };
  }

  await prisma.follow.create({
    data: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });

  return {
    following: true,
  };
}

export async function getFollowers(userId) {
  return await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    include: {
      follower: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getFollowing(userId) {
  return await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}