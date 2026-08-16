import { useEffect, useState } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../services/comment.service";
import { useAuth } from "../context/AuthContext";

export default function CommentSection({ postId }) {
  const { user: currentUser } = useAuth();

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

 async function loadComments() {
    try {
      setLoading(true);

      const response = await getComments(postId);

      setComments(response.comments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [postId]);


  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setSubmitting(true);

      const response = await createComment(
        postId,
        content.trim()
      );

      setComments((prev) => [
        ...prev,
        response.comment,
      ]);

      setContent("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal membuat komentar."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(comment) {
    setEditingId(comment.id);
    setEditContent(comment.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditContent("");
  }

  async function handleUpdate(commentId) {
    if (!editContent.trim()) return;

    try {
      const response = await updateComment(
        commentId,
        editContent.trim()
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? response.comment
            : comment
        )
      );

      cancelEdit();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal mengupdate komentar."
      );
    }
  }

  async function handleDelete(commentId) {
    const confirmed = window.confirm(
      "Yakin ingin menghapus komentar ini?"
    );

    if (!confirmed) return;

    try {
      await deleteComment(commentId);

      setComments((prev) =>
        prev.filter(
          (comment) => comment.id !== commentId
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal menghapus komentar."
      );
    }
  }


  return (
    <div className="mt-4 border-t pt-4">

      <h3 className="font-semibold mb-3">
        Komentar
      </h3>

      {/* FORM KOMENTAR */}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mb-4"
      >
        <input
          type="text"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          placeholder="Tulis komentar..."
          className="border rounded-lg px-3 py-2 flex-1"
          disabled={submitting}
        />

        <button
          type="submit"
          disabled={
            submitting || !content.trim()
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {submitting ? "..." : "Kirim"}
        </button>
      </form>
    </div>
  )
}