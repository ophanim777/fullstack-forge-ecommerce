import { prisma } from "../config/prisma.js";

export async function getProductImages(productId) {
  return prisma.productImage.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getProductImageById(id) {
  return prisma.productImage.findUnique({
    where: {
      id,
    },
  });
}

export async function createProductImage(productId, url) {
  return prisma.productImage.create({
    data: {
      productId,
      url,
    },
  });
}

export async function deleteProductImage(id) {
  return prisma.productImage.delete({
    where: {
      id,
    },
  });
}