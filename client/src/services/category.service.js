
import api from "../api/axios";

// Mengambil semua kategori produk
export async function getCategories() {
  const response = await api.get("/categories");
  return response.data.data;
}
