import { prisma } from "../config/prisma.js";

export async function getOrdersByUserId(userId) {
  return prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrderById(userId, orderId) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              images: true,
            },
          },
        },
      },
    },
  });
}

export async function createOrder(userId) {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      throw new Error("CART_NOT_FOUND");
    }

    if (cart.items.length === 0) {
      throw new Error("CART_EMPTY");
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new Error("INSUFFICIENT_STOCK");
      }
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const order = await tx.order.create({
      data: {
        userId,
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    for (const item of cart.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return order;
  });
}

export async function updateOrderStatus(orderId, status) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("ORDER_NOT_FOUND");
  }

  const allowedTransitions = {
    PENDING: ["PAID", "CANCELLED"],
    PAID: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[order.status].includes(status)) {
    throw new Error("INVALID_STATUS_TRANSITION");
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function cancelOrder(userId, orderId) {
  return prisma.$transaction(async (tx) => {
    // Pastikan pesanan ada dan merupakan milik pengguna.
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error("ORDER_NOT_FOUND");
    }

    // Pengguna hanya boleh membatalkan pesanan PENDING.
    if (order.status !== "PENDING") {
      throw new Error("ORDER_NOT_CANCELLABLE");
    }

    // Ubah status hanya jika pesanan masih PENDING.
    // Ini membantu mencegah pengembalian stok ganda.
    const result = await tx.order.updateMany({
      where: {
        id: orderId,
        userId,
        status: "PENDING",
      },
      data: {
        status: "CANCELLED",
      },
    });

    if (result.count !== 1) {
      throw new Error("ORDER_NOT_CANCELLABLE");
    }

    // Kembalikan stok setiap produk.
    for (const item of order.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    // Ambil pesanan terbaru untuk dikirim ke frontend.
    return tx.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
      },
    });
  });
}