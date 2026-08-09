import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getUserProfile, updateProfile, uploadAvatar, toggleFollow,
  getFollowing, } from "../services/user.service";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { username } = useParams();

  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  async function loadFollowStatus(userId) {
  if (!currentUser || currentUser.id === userId) {
    return;
  }

  try {
    const response = await getFollowing(currentUser.id);

    const isFollowing = response.following.some(
      (item) => item.following.id === userId
    );

    setFollowing(isFollowing);
  } catch (error) {
    console.error("Gagal mengecek status follow:", error);
  }
}

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const response = await getUserProfile(username);

      setUser(response.user);

      await loadFollowStatus(response.user.id);

      setForm({
        firstName: response.user.firstName || "",
        lastName: response.user.lastName || "",
        bio: response.user.bio || "",
      });

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Gagal mengambil profile."
      );
    } finally {
      setLoading(false);
    }
  }
  
  async function handleFollow() {
  if (!user) return;

  try {
    setFollowLoading(true);

    const response = await toggleFollow(user.id);

    setFollowing(response.following);
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Gagal mengubah status follow."
    );
  } finally {
    setFollowLoading(false);
  }
}

  useEffect(() => {
    loadProfile();
  }, [username]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

      alert("Profile berhasil diperbarui.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal memperbarui profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];

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
          "Gagal mengupload avatar."
      );
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center">
        <p className="text-gray-500">
          Memuat profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isOwnProfile =
    currentUser?.username === user.username;

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-3xl mx-auto px-4">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            {/* AVATAR */}
            <div className="relative">

              {user.avatar ? (
                <img
                  src={`http://localhost:5000${user.avatar}`}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
                  👤
                </div>
              )}

              {/* UPLOAD AVATAR */}
              {isOwnProfile && (
                <>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700"
                  >
                    📷
                  </label>

                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                  />
                </>
              )}
            </div>

            {/* USER INFO */}
            <div className="flex-1">

              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>

              <p className="text-gray-500">
                @{user.username}
              </p>

              {user.bio && (
                <p className="mt-2 text-gray-700">
                  {user.bio}
                </p>
              )}


              {uploading && (
                <p className="text-sm text-blue-600 mt-2">
                  Mengupload avatar...
                </p>
              )}

            </div>

            {/* EDIT BUTTON */}
            {isOwnProfile && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                ✏️ Edit Profile
              </button>
            )}

            {!isOwnProfile && currentUser && (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {followLoading
                ? "Loading..."
                : following
                ? "Unfollow"
                : "Follow"}
            </button>
)}

          </div>

          {/* EDIT FORM */}
          {editing && (
            <form
              onSubmit={handleUpdateProfile}
              className="border-t mt-6 pt-6"
            >

              <h2 className="text-lg font-bold mb-4">
                Edit Profile
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name
                  </label>

                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="border rounded-lg w-full p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name
                  </label>

                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="border rounded-lg w-full p-3"
                  />
                </div>

              </div>

              <div className="mt-4">

                <label className="block text-sm font-medium mb-1">
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows="3"
                  className="border rounded-lg w-full p-3"
                />

              </div>

              <div className="flex gap-2 mt-4">

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
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
                  className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>

              </div>

            </form>
          )}

          {/* POST COUNT */}
          <div className="border-t mt-5 pt-4">

            <p className="text-gray-600">
              <span className="font-bold">
                {user.posts.length}
              </span>{" "}
              Posts
            </p>

          </div>

        </div>

        {/* POSTS */}
        <div className="space-y-4">

          <h2 className="text-xl font-bold">
            Posts
          </h2>

          {user.posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
              Belum ada post.
            </div>
          ) : (
            user.posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow p-5"
              >

                <p className="text-gray-800 whitespace-pre-wrap">
                  {post.content}
                </p>

                <p className="text-sm text-gray-400 mt-3">
                  {new Date(
                    post.createdAt
                  ).toLocaleString()}
                </p>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}