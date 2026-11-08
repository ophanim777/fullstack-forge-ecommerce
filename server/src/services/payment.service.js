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



}