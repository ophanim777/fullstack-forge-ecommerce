import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
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

      <pre>
        {JSON.stringify(posts, null, 2)}
      </pre>
    </MainLayout>
  );
}