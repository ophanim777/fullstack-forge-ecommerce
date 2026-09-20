import { prisma } from "../config/prisma.js";

export async function getReviewsByProductId(productId) {
  return prisma.review.findMany({
    where: {
      productId,
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
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getReviewById(id) {
  return prisma.review.findUnique({
    where: {
      id,
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
      product: true,
    },
  });
}

export async function createReview(userId, productId, rating, comment) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingReview) {
    throw new Error("REVIEW_ALREADY_EXISTS");
  }

  return prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment: comment?.trim() || null,
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
      product: true,
    },
  });
}