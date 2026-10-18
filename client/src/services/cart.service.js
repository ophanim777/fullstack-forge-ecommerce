
import api from "../api/axios";

export async function getCart() {
  const response = await api.get("/cart");
  return response.data.data;
}

export async function addCartItem(productId, quantity = 1) {
  const response = await api.post("/cart/items", {
    productId,
    quantity,
  });

  return response.data.data;
}

export async function updateCartItem(itemId, quantity) {
  const response = await api.patch(`/cart/items/${itemId}`, {
    quantity,
  });

  return response.data.data;
}

export async function deleteCartItem(itemId) {
  const response = await api.delete(`/cart/items/${itemId}`);
  return response.data;
}
