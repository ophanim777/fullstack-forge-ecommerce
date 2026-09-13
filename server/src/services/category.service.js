import { prisma } from "../config/prisma.js";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}