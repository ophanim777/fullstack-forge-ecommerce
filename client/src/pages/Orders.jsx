
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getOrders } from "../services/order.service";

function formatRupiah(value) {
  return Number(value).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
}

function formatDate(value) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(
          err.response?.data?.message ??
            "Gagal mengambil riwayat pesanan."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <MainLayout>
      <section>
        <h1 className="text-3xl font-bold text-slate-900">
          Pesanan Saya
        </h1>

        <p className="mt-2 text-slate-600">
          Lihat riwayat dan status pesanan kamu.
        </p>

        {loading && (
          <p className="mt-6 text-slate-600">
            Memuat pesanan...
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

        {!loading && !error && orders.length === 0 && (
          <div className="mt-6 rounded-xl border bg-white p-8 text-center">
            <p className="text-lg font-semibold text-slate-800">
              Kamu belum memiliki pesanan.
            </p>

            <Link
              to="/products"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Mulai Belanja
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="mt-6 space-y-5">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-sm text-slate-500">
                      Nomor Pesanan
                    </p>

                    <p className="break-all font-semibold text-slate-900">
                      {order.id}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>

                <div className="my-4 border-t border-slate-200" />

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800">
                          {item.product.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {item.quantity} ×{" "}
                          {formatRupiah(item.price)}
                        </p>
                      </div>

                      <p className="shrink-0 font-medium text-slate-800">
                        {formatRupiah(
                          Number(item.price) * item.quantity
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="my-4 border-t border-slate-200" />

                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-800">
                    Total Pesanan
                  </span>

                  <span className="text-lg font-bold text-indigo-600">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}
