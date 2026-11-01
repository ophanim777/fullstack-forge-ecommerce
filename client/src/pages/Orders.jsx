
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
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

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

    const filteredOrders = orders.filter((order) => {
  const matchesStatus =
    selectedStatus === "ALL" ||
    order.status === selectedStatus;

  const query = searchQuery.toLowerCase().trim();

  const matchesSearch =
    order.id.toLowerCase().includes(query) ||
    order.items.some((item) =>
      item.product.name.toLowerCase().includes(query)
    );

  return matchesStatus && matchesSearch;
});

    const totalPages = Math.ceil(
      filteredOrders.length / ordersPerPage
    );

    const startIndex = (currentPage - 1) * ordersPerPage;

    const currentOrders = filteredOrders.slice(
      startIndex,
      startIndex + ordersPerPage
    );

  return (
    <MainLayout>
      <section>
        <h1 className="text-3xl font-bold text-slate-900">
          Pesanan Saya
        </h1>

        <p className="mt-2 text-slate-600">
          Lihat riwayat dan status pesanan kamu.
        </p>
        <div className="mt-5">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nomor pesanan atau nama produk..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { value: "ALL", label: "Semua" },
            { value: "PENDING", label: "Menunggu Pembayaran" },
            { value: "PAID", label: "Sudah Dibayar" },
            { value: "PROCESSING", label: "Diproses" },
            { value: "SHIPPED", label: "Dikirim" },
            { value: "DELIVERED", label: "Selesai" },
            { value: "CANCELLED", label: "Dibatalkan" },
          ].map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => setSelectedStatus(status.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedStatus === status.value
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

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
            {currentOrders.map((order) => (
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

        {!loading &&
          !error &&
          filteredOrders.length > ordersPerPage && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.max(page - 1, 1))
                }
                disabled={currentPage === 1}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sebelumnya
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "border text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
        )}

        {!loading &&
          !error &&
          orders.length > 0 &&
          filteredOrders.length === 0 && (
            <div className="mt-6 rounded-xl border bg-white p-8 text-center">
              <p className="font-semibold text-slate-800">
                Tidak ada pesanan dengan status ini.
              </p>
            </div>
          )}
      </section>
    </MainLayout>
  );
}
