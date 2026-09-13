import { prisma } from "../config/prisma.js";
import { Prisma } from "@prisma/client";

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
  try {
    return await prisma.category.create({
      data: {
        name: data.name.trim(),
        slug: data.slug.trim(),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("CATEGORY_SLUG_ALREADY_EXISTS");
    }

    throw error;
  }
}

export async function updateCategory(id, data) {
  const updateData = {};

  if (data.name !== undefined) {
    updateData.name = data.name.trim();
  }

  if (data.slug !== undefined) {
    updateData.slug = data.slug.trim();
  }

  try {
    return await prisma.category.update({
      where: {
        id,
      },
      data: updateData,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("CATEGORY_SLUG_ALREADY_EXISTS");
    }

    throw error;
  }
}

export async function deleteCategory(id) {
  return prisma.category.delete({
    where: {
      id,
    },
  });
}