import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/product.service";
import { addCartItem } from "../services/cart.service";
import {
  getReviewsByProductId,
  createReview,
} from "../services/review.service";
import { useAuth } from "../context/AuthContext";

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

  if (imagePath.startsWith("http")) return imagePath;

  return `http://localhost:5000${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderStars(rating) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  return "★".repeat(value) + "☆".repeat(5 - value);
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  async function loadReviews() {
    try {
      setReviewsLoading(true);
      setReviewsError("");

      const data = await getReviewsByProductId(id);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setReviewsError(
        err.response?.data?.message ?? "Gagal mengambil review produk."
      );
    } finally {
      setReviewsLoading(false);
    }
  }

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
          setError(
            err.response?.status === 404
              ? "Produk tidak ditemukan."
              : err.response?.data?.message ??
                  "Gagal mengambil detail produk. Silakan coba lagi."
          );
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

  useEffect(() => {
    loadReviews();
  }, [id]);

  async function handleAddToCart() {
    if (!user) {
      navigate("/login");
      return;
    }

    if (Number(product.stock) <= 0) {
      setCartError("Stok produk sedang habis.");
      return;
    }

    try {
      setCartLoading(true);
      setCartMessage("");
      setCartError("");

      await addCartItem(product.id, 1);
      setCartMessage("Produk berhasil ditambahkan ke keranjang.");
    } catch (err) {
      setCartError(
        err.response?.data?.message ??
          "Gagal menambahkan produk ke keranjang."
      );
    } finally {
      setCartLoading(false);
    }
  }

  async function handleSubmitReview(event) {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setReviewLoading(true);
      setReviewMessage("");
      setReviewError("");

      await createReview({
        productId: id,
        rating,
        comment,
      });

      setComment("");
      setRating(5);
      setReviewMessage("Review berhasil dikirim.");
      await loadReviews();
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;

      if (status === 403) {
        setReviewError(
          message ??
            "Kamu harus membeli produk ini terlebih dahulu sebelum memberikan review."
        );
      } else if (status === 409) {
        setReviewError(
          message ?? "Kamu sudah memberikan review untuk produk ini."
        );
      } else if (status === 401) {
        setReviewError("Silakan login kembali untuk memberikan review.");
      } else {
        const validationMessage = validationErrors
          ? Object.values(validationErrors).join(" ")
          : "";

        setReviewError(
          message || validationMessage || "Gagal mengirim review."
        );
      }
    } finally {
      setReviewLoading(false);
    }
  }

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

  if (!product) return null;

  const imageUrl = getImageUrl(product);
  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + Number(review.rating), 0) /
      reviews.length
    : 0;

  const userReview = user
    ? reviews.find((review) => review.user?.id === user.id)
    : null;

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

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={cartLoading || Number(product.stock) <= 0}
            className="mt-5 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cartLoading
              ? "Menambahkan..."
              : Number(product.stock) <= 0
                ? "Stok Habis"
                : "Tambah ke Keranjang"}
          </button>

          {cartMessage && (
            <p role="status" className="mt-3 text-sm text-green-700">
              {cartMessage}
            </p>
          )}

          {cartError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {cartError}
            </p>
          )}

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

      <section className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Rating dan Ulasan
        </h2>

        {!reviewsLoading && !reviewsError && (
          <div className="mt-3">
            <span className="text-xl font-semibold">
              {averageRating.toFixed(1)}
            </span>

            <span className="ml-2 text-lg text-amber-500">
              {renderStars(Math.round(averageRating))}
            </span>

            <p className="mt-1 text-sm text-gray-500">
              {reviews.length} ulasan
            </p>
          </div>
        )}

        {reviewsLoading ? (
          <p className="mt-5 text-gray-500">Memuat ulasan...</p>
        ) : reviewsError ? (
          <p role="alert" className="mt-5 text-red-600">
            {reviewsError}
          </p>
        ) : reviews.length === 0 ? (
          <p className="mt-5 text-gray-500">
            Belum ada ulasan untuk produk ini.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {reviews.map((review) => {
              const displayName =
                [review.user?.firstName, review.user?.lastName]
                  .filter(Boolean)
                  .join(" ") ||
                review.user?.username ||
                "Pengguna";

              return (
                <article
                  key={review.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900">
                      {displayName}
                    </p>

                    <time className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </time>
                  </div>

                  <p className="mt-2 text-lg text-amber-500">
                    {renderStars(review.rating)}
                  </p>

                  <p className="mt-2 whitespace-pre-line text-gray-700">
                    {review.comment || "Tidak ada komentar."}
                  </p>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-8 rounded-xl border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Tulis ulasan
          </h3>

          {!user ? (
            <p className="mt-3 text-gray-600">
              Silakan{" "}
              <Link
                to="/login"
                className="text-blue-700 hover:underline"
              >
                login
              </Link>{" "}
              untuk memberikan ulasan.
            </p>
          ) : reviewsLoading ? (
            <p className="mt-3 text-gray-500">
              Memeriksa ulasan kamu...
            </p>
          ) : userReview ? (
            <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-800">
              Kamu sudah memberikan ulasan untuk produk ini.
            </div>
          ) : (
            <form
              onSubmit={handleSubmitReview}
              className="mt-4 space-y-4"
            >
              <div>
                <label
                  htmlFor="review-rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rating
                </label>

                <select
                  id="review-rating"
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                  className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value={5}>5 - Sangat bagus</option>
                  <option value={4}>4 - Bagus</option>
                  <option value={3}>3 - Cukup</option>
                  <option value={2}>2 - Kurang</option>
                  <option value={1}>1 - Buruk</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Komentar
                </label>

                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Bagaimana pengalamanmu dengan produk ini?"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              {reviewMessage && (
                <p role="status" className="text-sm text-green-700">
                  {reviewMessage}
                </p>
              )}

              {reviewError && (
                <p role="alert" className="text-sm text-red-600">
                  {reviewError}
                </p>
              )}

              <button
                type="submit"
                disabled={reviewLoading}
                className="rounded-lg bg-indigo-700 px-5 py-3 font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {reviewLoading ? "Mengirim..." : "Kirim Ulasan"}
              </button>

              <p className="text-sm text-gray-500">
                Review hanya dapat diberikan untuk produk yang sudah dibeli
                dan memenuhi ketentuan pesanan.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
