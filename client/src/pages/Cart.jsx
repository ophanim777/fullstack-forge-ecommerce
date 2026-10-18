
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createOrder } from "../services/order.service";
import MainLayout from "../layouts/MainLayout";
import {
  getCart,
  updateCartItem,
  deleteCartItem,
} from "../services/cart.service";

function formatRupiah(value) {
  return Number(value).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
}

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyItemId, setBusyItemId] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const loadCart = useCallback(async () => {
    try {
      setError("");
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Gagal mengambil keranjang belanja."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  async function handleQuantityChange(item, quantity) {
    if (quantity < 1) return;

    if (quantity > item.product.stock) {
      setError(
        `Stok ${item.product.name} hanya ${item.product.stock} unit.`
      );
      return;
    }

    try {
      setBusyItemId(item.id);
      setError("");

      await updateCartItem(item.id, quantity);
      await loadCart();
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Gagal memperbarui jumlah produk."
      );
    } finally {
      setBusyItemId(null);
    }
  }

  async function handleDelete(itemId) {
    try {
      setBusyItemId(itemId);
      setError("");

      await deleteCartItem(itemId);
      await loadCart();
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Gagal menghapus produk dari keranjang."
      );
    } finally {
      setBusyItemId(null);
    }
  }

  
async function handleCheckout() {
  try {
    setCheckoutLoading(true);
    setError("");
    setSuccess("");

    const order = await createOrder();

    setSuccess(
      `Checkout berhasil! Nomor pesanan: ${order.id}`
    );

    await loadCart();
  } catch (err) {
    setError(
      err.response?.data?.message ??
        "Checkout gagal. Silakan coba lagi."
    );
  } finally {
    setCheckoutLoading(false);
  }
}


  const items = cart?.items ?? [];

  const total = items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  return (
    <MainLayout>
      <section>
        <h1 className="text-3xl font-bold text-slate-900">
          Keranjang Belanja
        </h1>

        <p className="mt-2 text-slate-600">
          Periksa produk sebelum melanjutkan ke checkout.
        </p>

        {loading && (
          <p className="mt-6 text-slate-600">
            Memuat keranjang...
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-lg bg-red-100 p-4 text-red-700"
          >
            {error}
          </p>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="mt-6 rounded-xl border bg-white p-8 text-center">
            <p className="text-lg font-semibold text-slate-800">
              Keranjang kamu masih kosong.
            </p>

            <Link
              to="/products"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Mulai Belanja
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="mt-6 space-y-4">
            {items.map((item) => {
              const product = item.product;
              const isBusy = busyItemId === item.id;

              return (
                <article
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-lg font-semibold text-slate-900 hover:text-indigo-600"
                      >
                        {product.name}
                      </Link>

                      <p className="mt-1 text-sm text-slate-500">
                        Harga: {formatRupiah(product.price)}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Stok tersedia: {product.stock}
                      </p>

                      <p className="mt-2 font-semibold text-indigo-600">
                        Subtotal:{" "}
                        {formatRupiah(
                          Number(product.price) * item.quantity
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isBusy || item.quantity <= 1}
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            item.quantity - 1
                          )
                        }
                        className="h-9 w-9 rounded border disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Kurangi jumlah ${product.name}`}
                      >
                        −
                      </button>

                      <span className="min-w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        disabled={
                          isBusy ||
                          item.quantity >= product.stock
                        }
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            item.quantity + 1
                          )
                        }
                        className="h-9 w-9 rounded border disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Tambah jumlah ${product.name}`}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDelete(item.id)}
                        className="ml-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="rounded-xl border bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-semibold text-slate-800">
                  Total Belanja
                </span>

                <span className="text-xl font-bold text-indigo-600">
                  {formatRupiah(total)}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Total ini dihitung berdasarkan harga produk saat ini.
                Biaya pengiriman belum termasuk.
              </p>

              <button
                type="button"
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-lg bg-slate-300 px-4 py-3 font-semibold text-slate-600"
                title="Checkout akan dibuat pada tahap berikutnya"
              >
                Checkout — Segera Hadir
              </button>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}
