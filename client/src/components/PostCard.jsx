import * as postService from "../services/post.service";
import { useState } from "react";
import CommentSection from "./CommentSection";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PostCard({ post, onDelete, onUpdate, }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(
  post.commentsCount || 0
);
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  async function handleLike() {
    try {
      const response = await postService.likePost(post.id);

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
    
    
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <Link to={`/profile/${post.author.username}`}>
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
            {post.author.firstName} {post.author.lastName}
          </Link>

          <p className="text-gray-500 text-sm">
            @{post.author.username}
          </p>
        </div>
      </div>

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

      <div className="border-t border-b py-3 mt-4">
        
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>
            ❤️ {likesCount} Likes
          </span>

          <span>
            💬 {commentsCount} Comments
          </span>
        </div>

        
       <div className="flex items-center gap-6 border-y py-3">

        {/* LIKE */}

        <button
          type="button"
          onClick={handleLike}
          className="flex flex-col items-center min-w-[60px] hover:scale-105 transition"
        >
          <span className="text-2xl">
            {liked ? "❤️" : "🤍"}
          </span>

          <span className="text-sm text-gray-600">
            {likesCount}
          </span>
        </button>


        {/* COMMENT */}

        <button
          type="button"
          onClick={() =>
            setCommentsOpen((prev) => !prev)
          }
          className={`flex flex-col items-center min-w-[60px] hover:scale-105 transition ${
            commentsOpen
              ? "text-blue-600"
              : "text-gray-600"
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

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex flex-col items-center min-w-[60px] text-gray-600 hover:text-blue-600"
        >
          <span className="text-2xl">
            ✏️
          </span>

          <span className="text-sm">
            Edit
          </span>
        </button>


        {/* DELETE */}

        <button
          type="button"
          onClick={handleDelete}
          className="flex flex-col items-center min-w-[60px] text-gray-600 hover:text-red-600"
        >
          <span className="text-2xl">
            🗑️
          </span>

          <span className="text-sm">
            Delete
          </span>
        </button>

      </div>
      </div>

      <div className="mt-3 text-sm text-gray-400">
        {new Date(post.createdAt).toLocaleString()}
      </div>

      {showComments && (
        <div className="mt-3">
          <CommentSection
            postId={post.id}
            onCommentCountChange={(change) => {
              setCommentsCount((prev) => prev + change);
            }}
          />
        </div>
      )}

    </div>
  );
}