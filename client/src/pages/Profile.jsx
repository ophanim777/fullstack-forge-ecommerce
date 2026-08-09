import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getUserProfile } from "../services/user.service";

export default function Profile() {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const response = await getUserProfile(username);

      setUser(response.user);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Gagal mengambil profile."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-gray-500">
          Memuat profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-3xl mx-auto px-4">

        {/* Profile */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <div className="flex items-center gap-5">

            {user.avatar ? (
              <img
                src={`http://localhost:5000${user.avatar}`}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
                👤
              </div>
            )}

            <div>
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
            </div>

          </div>

          <div className="border-t mt-5 pt-4">
            <p className="text-gray-600">
              <span className="font-bold">
                {user.posts.length}
              </span>{" "}
              Posts
            </p>
          </div>

        </div>

        {/* Posts */}
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