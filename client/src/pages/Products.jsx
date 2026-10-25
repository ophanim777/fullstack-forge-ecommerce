import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getProducts } from "../services/product.service";
import { getCategories } from "../services/category.service";
import { addCartItem } from "../services/cart.service";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [addingProductId, setAddingProductId] = useState(null);
  const [cartMessages, setCartMessages] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ??
              "Gagal mengambil daftar produk. Silakan coba lagi."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
  async function fetchCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    }
  }

  fetchCategories();
}, []);

  
    const filteredProducts = useMemo(() => {
      const keyword = searchTerm.trim().toLocaleLowerCase("id-ID");

      return products.filter((product) => {
        const matchesName = String(product.name ?? "")
          .toLocaleLowerCase("id-ID")
          .includes(keyword);

        const productCategoryId =
          product.categoryId ?? product.category?.id ?? "";

        const matchesCategory =
          selectedCategory === "all" ||
          String(productCategoryId) === String(selectedCategory);

        return matchesName && matchesCategory;
      });
    }, [products, searchTerm, selectedCategory]);


  async function handleAddToCart(product) {
    if (Number(product.stock) <= 0) {
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
      await addCartItem(product.id, 1);

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
      console.log(
        "Response backend:",
        JSON.stringify(err.response?.data, null, 2)
      );

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

        <div className="mt-6">
          <label
            htmlFor="product-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Cari produk berdasarkan nama
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="product-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Contoh: keyboard, mouse, monitor..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Hapus pencarian
              </button>
            )}
          </div>

          
          <div className="mt-4">
            <label
              htmlFor="product-category"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Filter berdasarkan kategori
            </label>

            <select
              id="product-category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
            >
              <option value="all">Semua Kategori</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>


          {!loading && !error && (
            <p className="mt-2 text-sm text-slate-500">
              Menampilkan {filteredProducts.length} dari {products.length} produk
            </p>
          )}
        </div>

        {loading && (
          <p className="mt-6 text-slate-600">Memuat produk...</p>
        )}

        {error && (
          <p role="alert" className="mt-6 rounded bg-red-100 p-4 text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="mt-6 text-slate-600">
            Belum ada produk yang tersedia.
          </p>
        )}

        {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-center">
            <p className="font-medium text-slate-800">
              Produk tidak ditemukan.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Coba kata kunci lain atau hapus pencarian.
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Tampilkan semua produk
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
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
                      Number(product.stock) <= 0 ||
                      addingProductId === product.id
                    }
                    className="mt-2 w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {addingProductId === product.id
                      ? "Menambahkan..."
                      : Number(product.stock) <= 0
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
