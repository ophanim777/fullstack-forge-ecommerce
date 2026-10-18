
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/product.service";

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

function getImageUrl(product) {
  const image = product.images?.[0];

  if (!image) return null;

  const imagePath = image.url ?? image.imageUrl ?? image.path;

  if (!imagePath) return null;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `http://localhost:5000${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) {
            setError("Produk tidak ditemukan.");
          } else {
            setError(
              err.response?.data?.message ??
                "Gagal mengambil detail produk. Silakan coba lagi.",
            );
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-gray-600">Memuat detail produk...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p role="alert" className="text-red-600">
          {error}
        </p>

        <Link
          to="/products"
          className="mt-4 inline-block text-blue-700 hover:underline"
        >
          Kembali ke katalog
        </Link>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  const imageUrl = getImageUrl(product);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to="/products"
        className="text-sm text-blue-700 hover:underline"
      >
        &larr; Kembali ke katalog
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-[500px] w-full object-contain"
            />
          ) : (
            <span className="text-gray-400">
              Belum ada gambar produk
            </span>
          )}
        </div>

        <section>
          <p className="text-sm text-gray-500">
            {product.category?.name ?? "Tanpa kategori"}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-5 text-2xl font-bold text-blue-700">
            {formatPrice(product.price)}
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Stok tersedia: {product.stock}
          </p>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Deskripsi produk
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-gray-700">
              {product.description || "Belum ada deskripsi produk."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
