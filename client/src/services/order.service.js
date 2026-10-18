
import api from "../api/axios";

export async function createOrder() {
  const response = await api.post("/orders");
  return response.data.data;
}

export async function getOrders() {
  const response = await api.get("/orders");
  return response.data.data;
}