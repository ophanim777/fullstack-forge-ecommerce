
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

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/orders/${id}`);

        if (!cancelled) {
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
