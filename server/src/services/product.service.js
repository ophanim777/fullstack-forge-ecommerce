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

export async function createProduct(data) {
  return prisma.product.create({
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
}