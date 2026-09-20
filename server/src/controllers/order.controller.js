import {
  getOrdersByUserId,
  getOrderById,
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