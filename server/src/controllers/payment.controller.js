import { createPayment } from "../services/payment.service.js";

export async function createPaymentController(req, res, next) {
  try {
    const payment = await createPayment(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Transaksi pembayaran berhasil dibuat.",
      data: payment,
    });
  } catch (error) {
    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Pesanan tidak ditemukan.",
      });
    }

    if (error.message === "ORDER_NOT_PAYABLE") {
      return res.status(400).json({
        success: false,
        message: "Pesanan ini tidak dapat dibayar.",
      });
    }

    if (error.message === "INVALID_ORDER_AMOUNT") {
      return res.status(400).json({
        success: false,
        message: "Nominal pembayaran tidak valid.",
      });
    }

    if (error.message === "PAYMENT_INITIALIZATION_CONFLICT") {
      return res.status(409).json({
        success: false,
        message: "Pembayaran sedang diproses. Silakan coba kembali.",
      });
    }

    if (error.message === "MIDTRANS_TRANSACTION_FAILED") {
      return res.status(502).json({
        success: false,
        message: "Gagal membuat transaksi pembayaran.",
      });
    }

    return next(error);
  }
}

export async function paymentNotificationController(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      message: "Notifikasi Midtrans diterima.",
    });
  } catch (error) {
    return next(error);
  }
}