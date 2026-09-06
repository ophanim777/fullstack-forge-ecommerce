import { prisma } from "../config/prisma.js";

export async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}