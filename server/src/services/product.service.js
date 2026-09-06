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