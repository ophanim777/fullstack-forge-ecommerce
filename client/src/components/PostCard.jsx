import * as postService from "../services/post.service";
import { useState } from "react";
import CommentSection from "./CommentSection";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PostCard({
  post,
  onDelete,
  onUpdate,
}) {
  const { user } = useAuth();

  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(
    post.likesCount
  );

  const [commentsCount, setCommentsCount] = useState(
    post.commentsCount || 0
  );

  const [showComments, setShowComments] =
    useState(false);

  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(
    post.content
  );

  async function handleLike() {
    try {
      const response = await postService.likePost(
        post.id
      );

      if (response.liked) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      } else {
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal memberi like."
      );
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus post ini?"
    );

    if (!confirmDelete) return;

    try {
      await postService.deletePost(post.id);

      onDelete(post.id);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal menghapus post."
      );
    }
  }

  async function handleUpdate() {
    try {
      const response = await postService.updatePost(
        post.id,
        {
          content: editContent,
        }
      );

      onUpdate(response.post);

      setEditing(false);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal mengupdate post."
      );
    }
  }

  const isOwner = user?.id === post.author.id;

  return (
    <div className="bg-white rounded-xl shadow p-5 mb-4">

      {/* =========================
          POST HEADER
      ========================= */}

      <div className="flex items-center gap-3 mb-4">

        <Link
          to={`/profile/${post.author.username}`}
        >
          <img
            src={
              post.author.avatar
                ? `http://localhost:5000${post.author.avatar}`
                : "https://via.placeholder.com/48"
            }
            alt={post.author.username}
            className="w-12 h-12 rounded-full object-cover hover:opacity-80"
          />
        </Link>

        <div>
          <Link
            to={`/profile/${post.author.username}`}
            className="font-bold hover:text-blue-600"
          >
            {post.author.firstName}{" "}
            {post.author.lastName}
          </Link>

          <p className="text-gray-500 text-sm">
            @{post.author.username}
          </p>
        </div>

      </div>


      {/* =========================
          POST CONTENT
      ========================= */}

      {editing ? (
        <>
          <textarea
            value={editContent}
            onChange={(e) =>
              setEditContent(e.target.value)
            }
            className="border rounded-lg w-full p-3 mb-3"
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditing(false);
                setEditContent(post.content);
              }}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="mb-4 whitespace-pre-wrap">
          {post.content}
        </p>
      )}


      {/* =========================
          SOCIAL MEDIA ACTIONS
      ========================= */}

      <div className="border-t border-b py-3 mt-4">

        <div className="flex items-center justify-around">

          {/* LIKE */}

          <button
            type="button"
            onClick={handleLike}
            className="flex flex-col items-center justify-center min-w-[70px] hover:scale-105 transition"
          >
            <span className="text-2xl">
              {liked ? "❤️" : "🤍"}
            </span>

            <span
              className={`text-sm ${
                liked
                  ? "text-red-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {likesCount}
            </span>
          </button>


          {/* COMMENT */}

          <button
            type="button"
            onClick={() =>
              setShowComments((prev) => !prev)
            }
            className={`flex flex-col items-center justify-center min-w-[70px] hover:scale-105 transition ${
              showComments
                ? "text-blue-600"
                : "text-gray-500"
            }`}
          >
            <span className="text-2xl">
              💬
            </span>

            <span className="text-sm">
              {commentsCount}
            </span>
          </button>


          {/* EDIT */}

          {isOwner && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex flex-col items-center justify-center min-w-[70px] text-gray-500 hover:text-blue-600 hover:scale-105 transition"
            >
              <span className="text-2xl">
                ✏️
              </span>

              <span className="text-sm">
                Edit
              </span>
            </button>
          )}


          {/* DELETE */}

          {isOwner && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex flex-col items-center justify-center min-w-[70px] text-gray-500 hover:text-red-600 hover:scale-105 transition"
            >
              <span className="text-2xl">
                🗑️
              </span>

              <span className="text-sm">
                Delete
              </span>
            </button>
          )}

        </div>

      </div>


      {/* =========================
          DATE
      ========================= */}

      <div className="mt-3 text-sm text-gray-400">
        {new Date(
          post.createdAt
        ).toLocaleString()}
      </div>


      {/* =========================
          COMMENTS
      ========================= */}

      {showComments && (
        <div className="mt-3">
          <CommentSection
            postId={post.id}
            onCommentCountChange={(change) => {
              setCommentsCount(
                (prev) => prev + change
              );
            }}
          />
        </div>
      )}

    </div>
  );
}