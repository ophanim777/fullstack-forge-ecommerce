
import api from "../api/axios";

// Mengambil semua review untuk satu produk
export async function getReviewsByProductId(productId) {
  const response = await api.get(
    `/reviews/product/${productId}`
  );

  return response.data.data;
}

// Menambahkan review untuk produk
export async function createReview({
  productId,
  rating,
  comment,
}) {
  const response = await api.post("/reviews", {
    productId,
    rating,
    comment,
  });

  return response.data.data;
}
