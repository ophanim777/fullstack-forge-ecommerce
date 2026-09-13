import { prisma } from "../config/prisma.js";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCategoryById(id) {
  return prisma.category.findUnique({
    where: {
      id,
    },
  });
}