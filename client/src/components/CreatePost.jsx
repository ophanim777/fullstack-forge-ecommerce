import { useState } from "react";
import * as postService from "../services/post.service";

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) {
      return alert("Post tidak boleh kosong.");
    }

    try {
      setLoading(true);

      const response = await postService.createPost({
        content,
      });

      setContent("");

      onPostCreated(response.post);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Gagal membuat post."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-5 mb-6"
    >
      <textarea
        rows="4"
        placeholder="Apa yang sedang kamu pikirkan?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border rounded-lg w-full p-3 resize-none"
      />

      <div className="flex justify-end mt-4">
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}