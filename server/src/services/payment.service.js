import { prisma } from "../config/prisma.js";
import { snap } from "../config/midtrans.js";
export async function createPayment(userId, orderId) {
     const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
  });

  if (!order) {
    throw new Error("ORDER_NOT_FOUND");
  }


   if (
    order.status !== "PENDING" ||
    order.paymentStatus !== "PENDING"
  ) {
    throw new Error("ORDER_NOT_PAYABLE");
  }

   if (order.snapToken && order.paymentUrl) {
    return {
      orderId: order.id,
      snapToken: order.snapToken,
      paymentUrl: order.paymentUrl,
    };
  }


     const grossAmount = Number(order.total);

  if (
    !Number.isSafeInteger(grossAmount) ||
    grossAmount <= 0
  ) {
    throw new Error("INVALID_ORDER_AMOUNT");
  }


  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: order.id,
      gross_amount: grossAmount,
    },
  });

  if (!transaction.token || !transaction.redirect_url) {
    throw new Error("MIDTRANS_TRANSACTION_FAILED");
  }



}