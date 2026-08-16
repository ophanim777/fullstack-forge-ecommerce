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

}