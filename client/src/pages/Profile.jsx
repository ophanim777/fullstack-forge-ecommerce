
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getUserProfile,
  updateProfile,
  uploadAvatar,
} from "../services/user.service";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });

  const isOwnProfile =
    currentUser?.username === user?.username;

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const response = await getUserProfile(username);
      const profile = response.user;

      setUser(profile);

      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        bio: profile.bio || "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Gagal mengambil data profil."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [username]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await updateProfile(form);

      setUser((prev) => ({
        ...prev,
        ...response.user,
      }));

      setEditing(false);
      alert("Profil berhasil diperbarui.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal memperbarui profil."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const response = await uploadAvatar(file);

      setUser((prev) => ({
        ...prev,
        avatar: response.user.avatar,
      }));

      alert("Avatar berhasil diperbarui.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal mengunggah avatar."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function getAvatarUrl(avatar) {
    if (!avatar) return "";

    if (avatar.startsWith("http")) {
      return avatar;
    }

    return `http://localhost:5000${avatar}`;
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <p className="text-slate-500">
          Memuat profil...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <p className="text-center text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={loadProfile}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          Coba Lagi
        </button>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            AKUN SAYA
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Profil Pengguna
          </h1>

          <p className="mt-2 text-slate-500">
            Kelola informasi akun dan preferensi profilmu.
          </p>
        </div>

        {/* PROFILE CARD */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-indigo-600 to-violet-500" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">
              {/* AVATAR */}
              <div className="relative h-24 w-24 shrink-0">
                {user.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt={`Avatar ${user.username}`}
                    className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-indigo-100 text-3xl font-bold text-indigo-700 shadow-sm">
                    {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                {isOwnProfile && (
                  <label
                    htmlFor="avatar-upload"
                    title="Ubah avatar"
                    className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <span aria-hidden="true">📷</span>
                    <span className="sr-only">
                      Ubah avatar
                    </span>
                  </label>
                )}

                {isOwnProfile && (
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                  />
                )}
              </div>

              {/* USER INFORMATION */}
              <div className="min-w-0 flex-1 pt-2 sm:pb-1">
                <h2 className="break-words text-2xl font-bold text-slate-900">
                  {user.firstName} {user.lastName}
                </h2>

                <p className="mt-1 text-slate-500">
                  @{user.username}
                </p>
              </div>

              {isOwnProfile && !editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Edit Profil
                </button>
              )}
            </div>

            {uploading && (
              <p className="mt-4 text-sm text-indigo-600">
                Mengunggah avatar...
              </p>
            )}

            {/* BIO */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <h3 className="font-semibold text-slate-900">
                Tentang Saya
              </h3>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {user.bio || "Belum ada bio."}
              </p>
            </div>

            {/* EDIT FORM */}
            {editing && isOwnProfile && (
              <form
                onSubmit={handleUpdateProfile}
                className="mt-6 border-t border-slate-100 pt-6"
              >
                <h3 className="mb-5 text-lg font-bold text-slate-900">
                  Edit Informasi Profil
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Nama Depan
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Nama Belakang
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="bio"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Bio
                  </label>

                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    placeholder="Ceritakan sedikit tentang dirimu..."
                    className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {form.bio.length}/500 karakter
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        bio: user.bio || "",
                      });
                    }}
                    disabled={saving}
                    className="rounded-lg bg-slate-100 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ACCOUNT INFORMATION */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Informasi Akun
          </h2>

          <div className="mt-4 divide-y divide-slate-100">
            <div className="flex flex-wrap justify-between gap-2 py-3">
              <span className="text-sm text-slate-500">
                Username
              </span>
              <span className="text-sm font-medium text-slate-800">
                @{user.username}
              </span>
            </div>

            <div className="flex flex-wrap justify-between gap-2 py-3">
              <span className="text-sm text-slate-500">
                Tipe Akun
              </span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {user.role === "ADMIN" ? "Administrator" : "Pelanggan"}
              </span>
            </div>
          </div>
        </section>

        {/* STORE LINK */}
        <section className="mt-6 flex flex-col gap-4 rounded-2xl bg-indigo-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-bold text-slate-900">
              Temukan Produk Favoritmu
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Jelajahi katalog dan temukan produk yang kamu butuhkan.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-center font-medium text-white transition hover:bg-indigo-700"
          >
            Lihat Produk
          </Link>
        </section>
      </div>
    </main>
  );
}
