import * as postService from "../services/post.service";
import { useState } from "react";
import CommentSection from "./CommentSection";


export default function PostCard({ post, onDelete, onUpdate, }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(
  post.commentsCount || 0
);
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
        <img
          src={
            post.author.avatar
              ? `http://localhost:5000${post.author.avatar}`
              : "https://via.placeholder.com/48"
          }
          alt={post.author.username}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <h2 className="font-bold">
            {post.author.firstName} {post.author.lastName}
          </h2>

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

      <div className="flex justify-between items-center">
        <button
          onClick={handleLike}
          className="text-red-500 font-semibold"
        >
          {liked ? "❤️ Unlike" : "🤍 Like"}
        </button>

        <button
        onClick={() => setEditing(true)}
        className="text-blue-600 font-semibold"
        >
        ✏️ Edit
        </button> 

        <button
            onClick={handleDelete}
            className="text-gray-600 font-semibold"
            >
            🗑️ Delete
            </button>

        <div className="flex gap-4 text-gray-500">
          <span>
            {likesCount} Likes
          </span>

          <span>
            💬 {commentsCount} Comments
          </span>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-400">
        {new Date(post.createdAt).toLocaleString()}
      </div>

      <CommentSection postId={post.id} />
    </div>
  );
}