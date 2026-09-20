import { prisma } from "../config/prisma.js";

export async function getCartByUserId(userId) {
  return prisma.cart.findUnique({
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
  });
}

export async function createCart(userId) {
  return prisma.cart.create({
    data: {
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

export async function addCartItem(userId, productId, quantity) {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    throw new Error("CART_NOT_FOUND");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  if (quantity > product.stock) {
    throw new Error("INSUFFICIENT_STOCK");
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new Error("INSUFFICIENT_STOCK");
    }

    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: newQuantity,
      },
      include: {
        product: {
          include: {
            category: true,
            images: true,
          },
        },
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
    include: {
      product: {
        include: {
          category: true,
          images: true,
        },
      },
    },
  });
}

export async function updateCartItem(userId, itemId, quantity) {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    throw new Error("CART_NOT_FOUND");
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
    include: {
      product: true,
    },
  });

  if (!cartItem) {
    throw new Error("CART_ITEM_NOT_FOUND");
  }

  if (quantity > cartItem.product.stock) {
    throw new Error("INSUFFICIENT_STOCK");
  }

  return prisma.cartItem.update({
    where: {
      id: cartItem.id,
    },
    data: {
      quantity,
    },
    include: {
      product: {
        include: {
          category: true,
          images: true,
        },
      },
    },
  });
}


export async function deleteCartItem(userId, itemId) {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    throw new Error("CART_NOT_FOUND");
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  if (!cartItem) {
    throw new Error("CART_ITEM_NOT_FOUND");
  }

  return prisma.cartItem.delete({
    where: {
      id: cartItem.id,
    },
  });
}