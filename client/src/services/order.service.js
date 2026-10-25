
import api from "../api/axios";

export async function createOrder(shippingData) {
  const response = await api.post("/orders", shippingData);
  return response.data.data;
}


export async function getOrders() {
  const response = await api.get("/orders");
  return response.data.data;
}