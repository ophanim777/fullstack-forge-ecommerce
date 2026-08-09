import { prisma } from "../config/prisma.js";

export async function updateProfile(userId, data) {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data,

    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      bio: true,
      avatar: true,
      role: true,
    },
  });
}

export async function updateAvatar(userId, avatarPath) {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      avatar: avatarPath,
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      bio: true,
      avatar: true,
      role: true,
    },
  });
}

export async function getProfileByUsername(username) {
  return prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      bio: true,
      avatar: true,
      role: true,

      posts: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          content: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}