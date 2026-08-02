import * as postService from "../services/post.service";
import { useState } from "react";


export default function PostCard({ post, onDelete, }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

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
    
    
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={`http://localhost:5000${post.author.avatar}`}
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

      <p className="mb-4 whitespace-pre-wrap">
        {post.content}
      </p>

      <div className="flex justify-between items-center">
        <button
          onClick={handleLike}
          className="text-red-500 font-semibold"
        >
          {liked ? "❤️ Unlike" : "🤍 Like"}
        </button>

        <span className="text-gray-500">
          {likesCount} Likes
        </span>
      </div>

      <div className="mt-3 text-sm text-gray-400">
        {new Date(post.createdAt).toLocaleString()}
      </div>
    </div>
  );
}