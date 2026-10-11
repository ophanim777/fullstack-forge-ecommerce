import { prisma } from "../config/prisma.js";
import { Prisma } from "@prisma/client";

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

export async function getProductById(id) {
  return prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      images: true,
    },
  });
}

export async function createProduct(data) {
  try {
    return await prisma.product.create({
      data: {
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description.trim(),
        price: data.price,
        stock: Number(data.stock),
        categoryId: data.categoryId,
      },
      include: {
        category: true,
        images: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("PRODUCT_SLUG_ALREADY_EXISTS");
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new Error("PRODUCT_CATEGORY_NOT_FOUND");
    }

    throw error;
  }
}

export async function updateProduct(id, data) {
  const updateData = {};

  if (data.name !== undefined) {
    updateData.name = data.name.trim();
  }

  if (data.slug !== undefined) {
    updateData.slug = data.slug.trim();
  }

  if (data.description !== undefined) {
    updateData.description = data.description.trim();
  }

  if (data.price !== undefined) {
    updateData.price = data.price;
  }

  if (data.stock !== undefined) {
    updateData.stock = Number(data.stock);
  }

  if (data.categoryId !== undefined) {
    updateData.categoryId = data.categoryId;
  }

  try {
    return await prisma.product.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        category: true,
        images: true,
      },
    });
  } catch (error) {
    
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("PRODUCT_SLUG_ALREADY_EXISTS");
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new Error("PRODUCT_CATEGORY_NOT_FOUND");
    }

    throw error;
  }
}

export async function deleteProduct(id) {
  return prisma.product.delete({
    where: {
      id,
    },
  });
}