import {
  getOrdersByUserId,
  getOrderById,
  createOrder,
} from "../services/order.service.js";

export async function getOrdersController(req, res, next) {
  try {
    const orders = await getOrdersByUserId(req.user.id);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderByIdController(req, res, next) {
  try {
    const order = await getOrderById(
      req.user.id,
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function createOrderController(req, res, next) {
  try {
    const order = await createOrder(req.user.id);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    if (error.message === "CART_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Cart tidak ditemukan.",
      });
    }

    if (error.message === "CART_EMPTY") {
      return res.status(400).json({
        success: false,
        message: "Cart masih kosong.",
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