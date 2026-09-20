import {
  getOrdersByUserId,
  getOrderById,
  createOrder,
  updateOrderStatus,
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


export async function updateOrderStatusController(req, res, next) {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "PAID",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status order tidak valid.",
      });
    }

    const order = await updateOrderStatus(
      req.params.id,
      status
    );

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan.",
      });
    }

    if (error.message === "INVALID_STATUS_TRANSITION") {
    return res.status(409).json({
        success: false,
        message: "Transisi status order tidak valid.",
    });
    }

    next(error);
  }
}