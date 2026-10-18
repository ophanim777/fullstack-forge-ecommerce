
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getProducts } from "../services/product.service";
import { addCartItem } from "../services/cart.service";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingProductId, setAddingProductId] = useState(null);
  const [cartMessages, setCartMessages] = useState({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(
          err.response?.data?.message ??
            "Gagal mengambil daftar produk. Silakan coba lagi."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  async function handleAddToCart(product) {
    if (product.stock <= 0) {
      setCartMessages((prev) => ({
        ...prev,
        [product.id]: {
          type: "error",
          text: "Maaf, produk sedang habis.",
        },
      }));
      return;
    }

    setAddingProductId(product.id);
    setCartMessages((prev) => ({
      ...prev,
      [product.id]: null,
    }));

    try {
      await addCartItem({
        productId: product.id,
        quantity: 1,
      });

      setCartMessages((prev) => ({
        ...prev,
        [product.id]: {
          type: "success",
          text: "Produk berhasil ditambahkan ke keranjang.",
        },
      }));
    } catch (err) {
          console.error("Gagal menambahkan ke keranjang:", err);
          console.error("HTTP status:", err.response?.status);
          console.error("Response backend:", err.response?.data);

          const message =
            err.response?.data?.message ??
            err.message ??
            "Gagal menambahkan produk ke keranjang.";

          setCartMessages((prev) => ({
            ...prev,
            [product.id]: {
              type: "error",
              text: message,
            },
          }));
        } finally {
          setAddingProductId(null);
        }
          }

  return (
    <MainLayout>
      <section>
        <h1 className="text-3xl font-bold text-slate-900">
          Katalog Produk
        </h1>

        <p className="mt-2 text-slate-600">
          Temukan produk yang kamu butuhkan.
        </p>

        {loading && (
          <p className="mt-6 text-slate-600">
            Memuat produk...
          </p>
        )}

        {error && (
          <p className="mt-6 rounded bg-red-100 p-4 text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="mt-6 text-slate-600">
            Belum ada produk yang tersedia.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-400">
                  Tidak ada gambar
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {product.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {product.description}
                  </p>

                  <p className="mt-4 text-xl font-bold text-indigo-600">
                    {Number(product.price).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    })}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Stok: {product.stock}
                  </p>

                  <Link
                    to={`/products/${product.id}`}
                    className="mt-4 block rounded-lg bg-indigo-600 px-4 py-2 text-center font-medium text-white hover:bg-indigo-700"
                  >
                    Lihat Detail
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={
                      product.stock <= 0 ||
                      addingProductId === product.id
                    }
                    className="mt-2 w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {addingProductId === product.id
                      ? "Menambahkan..."
                      : product.stock <= 0
                        ? "Stok Habis"
                        : "Tambah ke Keranjang"}
                  </button>

                  {cartMessages[product.id] && (
                    <p
                      role="status"
                      className={`mt-2 text-sm ${
                        cartMessages[product.id].type === "success"
                          ? "text-emerald-700"
                          : "text-red-600"
                      }`}
                    >
                      {cartMessages[product.id].text}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}
