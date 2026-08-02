import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard";
import * as postService from "../services/post.service";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const response = await postService.getPosts();

      setPosts(response.posts);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">
        Feed
      </h1>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </MainLayout>
  );
}