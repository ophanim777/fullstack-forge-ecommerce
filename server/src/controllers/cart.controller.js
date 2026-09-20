import {
  getCartByUserId,
  createCart,
  addCartItem,
} from "../services/cart.service.js";

import { validateAddCartItem } from "../validators/cart.validator.js";

export async function getCartController(req, res, next) {
  try {
    let cart = await getCartByUserId(req.user.id);

    if (!cart) {
      cart = await createCart(req.user.id);
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
}


export async function addCartItemController(req, res, next) {
  try {
    const { isValid, errors } = validateAddCartItem(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const item = await addCartItem(
      req.user.id,
      req.body.productId,
      Number(req.body.quantity)
    );

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    if (error.message === "CART_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Cart tidak ditemukan.",
      });
    }

    if (error.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan.",
      });
    }

    if (error.message === "INSUFFICIENT_STOCK") {
      return res.status(409).json({
        success: false,
        message: "Stok product tidak mencukupi.",
      });
    }

    next(error);
  }
}