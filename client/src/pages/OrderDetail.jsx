
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";

function formatRupiah(value) {
  return Number(value).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
}

function formatDate(value) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

const statusLabels = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  PROCESSING: "Sedang Diproses",
  SHIPPED: "Dalam Pengiriman",
  DELIVERED: "Pesanan Diterima",
  CANCELLED: "Dibatalkan",
};

export default function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/orders/${id}`);

        if (!cancelled) {
            console.log("DATA ORDER:", response.data.data);
console.log("STATUS ORDER:", response.data.data?.status);

setOrder(response.data.data);
          setOrder(response.data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ??
              "Gagal mengambil detail pesanan."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleCancelOrder() {
  const confirmed = window.confirm(
    "Apakah kamu yakin ingin membatalkan pesanan ini?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setCancelLoading(true);
    setError("");
    setSuccess("");

    const response = await api.patch(
      `/orders/${id}/cancel`
    );
    console.log("DATA ORDER:", response.data.data);
console.log("STATUS ORDER:", response.data.data?.status);

    setOrder(response.data.data);
    setSuccess("Pesanan berhasil dibatalkan. Stok produk telah dikembalikan.");
  } catch (err) {
    setError(
      err.response?.data?.message ??
        "Gagal membatalkan pesanan."
    );
  } finally {
    setCancelLoading(false);
  }
}

  return (
    <MainLayout>
      <section className="mx-auto max-w-4xl">
        <Link
          to="/orders"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          &larr; Kembali ke Pesanan Saya
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Detail Pesanan
        </h1>

        {loading && (
          <p className="mt-6 text-slate-600">
            Memuat detail pesanan...
          </p>
        )}


        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg bg-red-100 p-4 text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
            <div
                role="status"
                className="mt-4 rounded-lg bg-green-100 p-4 text-green-700"
            >
                {success}
            </div>
            )}

        {!loading && !error && order && (
          <div className="mt-6 space-y-5">
            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-slate-500">
                Nomor Pesanan
              </p>

              <p className="mt-1 break-all font-semibold text-slate-900">
                {order.id}
              </p>

              <p className="mt-4 text-sm text-slate-500">
                Tanggal Pesanan
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {formatDate(order.createdAt)}
              </p>

              <p className="mt-4 text-sm text-slate-500">
                Status Pesanan
              </p>

              <span className="mt-2 inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                {statusLabels[order.status] ?? order.status}
              </span>

              
              <div className="mt-6 border-t border-slate-200 pt-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Alamat Pengiriman
                </h2>

                {order.shippingName &&
                order.shippingPhone &&
                order.shippingAddress &&
                order.shippingCity ? (
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="font-medium">Nama Penerima:</span>{" "}
                      {order.shippingName}
                    </p>

                    <p>
                      <span className="font-medium">Nomor Telepon:</span>{" "}
                      {order.shippingPhone}
                    </p>

                    <p>
                      <span className="font-medium">Alamat:</span>{" "}
                      {order.shippingAddress}
                    </p>

                    <p>
                      <span className="font-medium">Kota/Kabupaten:</span>{" "}
                      {order.shippingCity}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">
                    Informasi alamat pengiriman tidak tersedia untuk pesanan ini.
                  </p>
                )}
              </div>

              
              {order.status === "PENDING" && (
                <div className="mt-5">
                    <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={cancelLoading}
                    className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                    {cancelLoading
                        ? "Membatalkan Pesanan..."
                        : "Batalkan Pesanan"}
                    </button>
                </div>
                )}
            </div>

            <div className="rounded-xl border bg-white p-5">
              <h2 className="text-xl font-bold text-slate-900">
                Produk yang Dipesan
              </h2>

              <div className="mt-4 divide-y divide-slate-200">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.product.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.quantity} ×{" "}
                        {formatRupiah(item.price)}
                      </p>
                    </div>

                    <p className="shrink-0 font-semibold text-slate-800">
                      {formatRupiah(
                        Number(item.price) * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex justify-between gap-4 border-t pt-4">
                <span className="font-semibold text-slate-800">
                  Total Pesanan
                </span>

                <span className="text-xl font-bold text-indigo-600">
                  {formatRupiah(order.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}

console.log("OrderDetail.jsx sedang dijalankan");