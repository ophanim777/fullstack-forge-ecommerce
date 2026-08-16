import api from "../api/axios";

export async function getComments(postId) {
  const response = await api.get(
    `/posts/${postId}/comments`
  );

  return response.data;
}