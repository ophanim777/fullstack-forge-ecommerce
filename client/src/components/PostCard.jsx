import * as postService from "../services/post.service";
import { useState } from "react";


export default function PostCard({ post }) {
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

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>❤️ {post.likesCount} Likes</span>

        <span>
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}