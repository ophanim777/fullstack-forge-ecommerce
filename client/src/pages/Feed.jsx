import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import * as postService from "../services/post.service";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  async function loadFeed(pageNumber) {
    try {
      setLoading(true);

      const response = await postService.getFeed(
        pageNumber,
        10
      );

      setPosts((prevPosts) => [
        ...prevPosts,
        ...response.posts,
      ]);

      setHasNextPage(response.hasNextPage);
    } catch (error) {
      console.error("Gagal mengambil feed:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeed(1);
  }, []);

  function handlePostCreated(post) {
    setPosts((prevPosts) => [post, ...prevPosts]);
  }

  function handleDeletePost(postId) {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== postId)
    );
  }

  function handleUpdatePost(updatedPost) {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id
          ? updatedPost
          : post
      )
    );
  }

  async function handleLoadMore() {
    if (loading || !hasNextPage) {
      return;
    }

    const nextPage = page + 1;

    await loadFeed(nextPage);

    setPage(nextPage);
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">
        Feed
      </h1>

      <CreatePost
        onPostCreated={handlePostCreated}
      />

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={handleDeletePost}
            onUpdate={handleUpdatePost}
          />
        ))}
      </div>

      <div className="flex justify-center py-6">
        {hasNextPage ? (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {loading
              ? "Memuat..."
              : "Muat lebih banyak"}
          </button>
        ) : (
          <p className="text-gray-500">
            Tidak ada post lagi.
          </p>
        )}
      </div>
    </MainLayout>
  );
}