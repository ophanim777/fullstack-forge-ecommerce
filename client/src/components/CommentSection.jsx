import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../services/comment.service";

import { useAuth } from "../context/AuthContext";

export default function CommentSection({
  postId,
  onCommentCountChange,
}) {
  const navigate = useNavigate();

  const { user: currentUser } = useAuth();

  const [comments, setComments] = useState([]);

  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

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

  // =========================
  // CREATE COMMENT
  // =========================

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
        {
          ...response.comment,
          replies: [],
        },
      ]);

      setContent("");

      onCommentCountChange?.(1);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal mengirim komentar."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =========================
  // REPLY
  // =========================

  async function handleReplySubmit(e, parentId) {
    e.preventDefault();

    if (!replyContent.trim()) return;

    try {
      const response = await createComment(
        postId,
        replyContent.trim(),
        parentId
      );

      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id !== parentId) {
            return comment;
          }

          return {
            ...comment,
            replies: [
              ...(comment.replies || []),
              response.comment,
            ],
          };
        })
      );

      setReplyContent("");
      setReplyingTo(null);

      onCommentCountChange?.(1);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Gagal mengirim reply."
      );
    }
  }

  // =========================
  // EDIT
  // =========================

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
            ? {
                ...comment,
                ...response.comment,
              }
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

  // =========================
  // DELETE
  // =========================

  async function handleDelete(commentId) {
  const confirmed = window.confirm(
    "Yakin ingin menghapus komentar ini?"
  );

  if (!confirmed) return;

  try {
    await deleteComment(commentId);

    setComments((prev) =>
      prev
        // Hapus komentar utama
        .filter(
          (comment) => comment.id !== commentId
        )
        // Hapus reply
        .map((comment) => ({
          ...comment,
          replies: (comment.replies || []).filter(
            (reply) => reply.id !== commentId
          ),
        }))
    );

    onCommentCountChange?.(-1);
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Gagal menghapus komentar."
    );
  }
}

  // =========================
  // RENDER
  // =========================

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

      {/* DAFTAR KOMENTAR */}

      {loading ? (
        <p className="text-gray-500 text-sm">
          Memuat komentar...
        </p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Belum ada komentar.
        </p>
      ) : (
        <div className="space-y-3">

          {comments.map((comment) => {

            const isOwner =
              currentUser?.id === comment.user.id;

            return (
              <div
                key={comment.id}
                className="bg-gray-50 rounded-lg p-3"
              >

                {/* COMMENT HEADER */}

                <div className="flex gap-3">

                  {/* AVATAR */}

                  {comment.user.avatar ? (
                    <img
                      src={`http://localhost:5000${comment.user.avatar}`}
                      alt={comment.user.username}
                      onClick={() =>
                        navigate(
                          `/profile/${comment.user.username}`
                        )
                      }
                      className="w-9 h-9 rounded-full object-cover cursor-pointer"
                    />
                  ) : (
                    <div
                      onClick={() =>
                        navigate(
                          `/profile/${comment.user.username}`
                        )
                      }
                      className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                    >
                      👤
                    </div>
                  )}

                  <div className="flex-1">

                    {/* USER INFO + ACTION */}

                    <div className="flex justify-between">

                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/profile/${comment.user.username}`
                          )
                        }
                      >
                        <p className="font-semibold hover:text-blue-600">
                          {comment.user.firstName}{" "}
                          {comment.user.lastName}
                        </p>

                        <p className="text-xs text-gray-500">
                          @{comment.user.username}
                        </p>
                      </div>

                      <div className="flex gap-2 text-sm">

                        {/* EDIT */}

                        {isOwner && (
                          <button
                            onClick={() =>
                              startEdit(comment)
                            }
                            className="text-blue-600"
                          >
                            Edit
                          </button>
                        )}

                        {/* DELETE */}

                        {isOwner && (
                          <button
                            onClick={() =>
                              handleDelete(comment.id)
                            }
                            className="text-red-600"
                          >
                            Hapus
                          </button>
                        )}

                        {/* REPLY */}

                        <button
                          onClick={() => {
                            setReplyingTo(comment.id);
                            setReplyContent("");
                          }}
                          className="text-blue-600 font-semibold"
                        >
                          Reply
                        </button>

                      </div>

                    </div>

                    {/* CONTENT */}

                    {editingId === comment.id ? (
                      <div className="mt-2">

                        <textarea
                          value={editContent}
                          onChange={(e) =>
                            setEditContent(
                              e.target.value
                            )
                          }
                          className="border rounded-lg w-full p-2"
                          rows="2"
                        />

                        <div className="flex gap-2 mt-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdate(
                                comment.id
                              )
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Simpan
                          </button>

                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="bg-gray-200 px-3 py-1 rounded"
                          >
                            Batal
                          </button>

                        </div>

                      </div>
                    ) : (
                      <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}

                    {/* DATE */}

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(
                        comment.createdAt
                      ).toLocaleString()}
                    </p>

                    {/* REPLY FORM */}

                    {replyingTo === comment.id && (
                      <form
                        onSubmit={(e) =>
                          handleReplySubmit(
                            e,
                            comment.id
                          )
                        }
                        className="mt-3 flex gap-2"
                      >
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) =>
                            setReplyContent(
                              e.target.value
                            )
                          }
                          placeholder="Tulis balasan..."
                          className="border rounded-lg px-3 py-2 flex-1"
                        />

                        <button
                          type="submit"
                          disabled={!replyContent.trim()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                          Reply
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent("");
                          }}
                          className="bg-gray-200 px-4 py-2 rounded-lg"
                        >
                          Batal
                        </button>
                      </form>
                    )}

                    {/* REPLIES */}

                    {comment.replies?.length > 0 && (
                      <div className="ml-10 mt-3 space-y-3 border-l-2 pl-4">

                        {comment.replies.map((reply) => {
                          const isReplyOwner =
                            currentUser?.id === reply.user.id;

                          return (
                            <div
                              key={reply.id}
                              className="bg-white rounded-lg p-3"
                            >
                              <div className="flex gap-2">

                                {/* AVATAR */}

                                {reply.user.avatar ? (
                                  <img
                                    src={`http://localhost:5000${reply.user.avatar}`}
                                    alt={reply.user.username}
                                    onClick={() =>
                                      navigate(
                                        `/profile/${reply.user.username}`
                                      )
                                    }
                                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                                  />
                                ) : (
                                  <div
                                    onClick={() =>
                                      navigate(
                                        `/profile/${reply.user.username}`
                                      )
                                    }
                                    className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                                  >
                                    👤
                                  </div>
                                )}

                                <div className="flex-1">

                                  {/* HEADER */}

                                  <div className="flex justify-between">

                                    <div
                                      className="cursor-pointer"
                                      onClick={() =>
                                        navigate(
                                          `/profile/${reply.user.username}`
                                        )
                                      }
                                    >
                                      <p className="font-semibold text-sm hover:text-blue-600">
                                        {reply.user.firstName}{" "}
                                        {reply.user.lastName}
                                      </p>

                                      <p className="text-xs text-gray-500">
                                        @{reply.user.username}
                                      </p>
                                    </div>

                                    {/* ACTION */}

                                    {isReplyOwner && (
                                      <div className="flex gap-2 text-xs">

                                        <button
                                          onClick={() =>
                                            startEdit(reply)
                                          }
                                          className="text-blue-600"
                                        >
                                          Edit
                                        </button>

                                        <button
                                          onClick={() =>
                                            handleDelete(reply.id)
                                          }
                                          className="text-red-600"
                                        >
                                          Hapus
                                        </button>

                                      </div>
                                    )}

                                  </div>

                                  {/* CONTENT */}

                                  {editingId === reply.id ? (
                                    <div className="mt-2">

                                      <textarea
                                        value={editContent}
                                        onChange={(e) =>
                                          setEditContent(e.target.value)
                                        }
                                        className="border rounded-lg w-full p-2"
                                        rows="2"
                                      />

                                      <div className="flex gap-2 mt-2">

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleUpdate(reply.id)
                                          }
                                          className="bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                          Simpan
                                        </button>

                                        <button
                                          type="button"
                                          onClick={cancelEdit}
                                          className="bg-gray-200 px-3 py-1 rounded"
                                        >
                                          Batal
                                        </button>

                                      </div>

                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                                      {reply.content}
                                    </p>
                                  )}

                                  {/* DATE */}

                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(
                                      reply.createdAt
                                    ).toLocaleString()}
                                  </p>

                                </div>
                              </div>
                            </div>
                          );
                        })}

                      </div>
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}