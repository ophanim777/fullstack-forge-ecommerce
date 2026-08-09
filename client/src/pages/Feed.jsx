import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
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
    </MainLayout>
  );
}