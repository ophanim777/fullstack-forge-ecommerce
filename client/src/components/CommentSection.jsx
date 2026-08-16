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

}