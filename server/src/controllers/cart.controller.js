import {
  getCartByUserId,
  createCart,
} from "../services/cart.service.js";

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