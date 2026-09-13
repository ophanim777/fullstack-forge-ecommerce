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

export async function createCategory(data) {
  return prisma.category.create({
    data: {
      name: data.name.trim(),
      slug: data.slug.trim(),
    },
  });
}