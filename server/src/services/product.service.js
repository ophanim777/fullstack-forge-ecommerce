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

  return prisma.product.update({
    where: {
      id,
    },
    data: updateData,
    include: {
      category: true,
      images: true,
    },
  });
}