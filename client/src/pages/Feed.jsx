import { useEffect, useRef, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import * as postService from "../services/post.service";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [loading, setLoading] = useState(false);

  const observerRef = useRef(null);

  const LIMIT = 10;

  async function loadPosts(pageNumber) {
    if (loading || !hasNextPage) return;

    try {
      setLoading(true);

      const response = await postService.getFeed(
        pageNumber,
        LIMIT
      );

      setPosts((prevPosts) => [
        ...prevPosts,
        ...response.posts,
      ]);

      setHasNextPage(response.hasNextPage);
      setPage(pageNumber);
    } catch (error) {
      console.error(
        "Gagal mengambil feed:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // Load halaman pertama
  useEffect(() => {
    loadPosts(1);
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading
        ) {
          loadPosts(page + 1);
        }
      },
      {
        threshold: 1,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page, loading, hasNextPage]);

  function handlePostCreated(post) {
    setPosts((prevPosts) => [
      post,
      ...prevPosts,
    ]);
  }

  function handleDeletePost(postId) {
    setPosts((prevPosts) =>
      prevPosts.filter(
        (post) => post.id !== postId
      )
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

      {/* Infinite scroll trigger */}
      <div
        ref={observerRef}
        className="py-8 text-center"
      >
        {loading && (
          <p className="text-gray-500">
            Memuat post...
          </p>
        )}

        {!loading && !hasNextPage && posts.length > 0 && (
          <p className="text-gray-400">
            Tidak ada post lagi.
          </p>
        )}
      </div>
    </MainLayout>
  );
}