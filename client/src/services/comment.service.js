import api from "../api/axios";

export async function getComments(postId) {
  const response = await api.get(
    `/posts/${postId}/comments`
  );

  return response.data;
}

export async function createComment(postId, content) {
  const response = await api.post(
    `/posts/${postId}/comments`,
    {
      content,
    }
  );

  return response.data;
}

export async function updateComment(commentId, content) {
  const response = await api.patch(
    `/comments/${commentId}`,
    {
      content,
    }
  );

  return response.data;
}

export async function deleteComment(commentId) {
  const response = await api.delete(
    `/comments/${commentId}`
  );

  return response.data;
}