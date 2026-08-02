import api from "../api/axios";

export async function getPosts() {
  const response = await api.get("/posts");
  return response.data;
}

export async function getPost(id) {
  const response = await api.get(`/posts/${id}`);
  return response.data;
}

export async function createPost(data) {
  const response = await api.post("/posts", data);
  return response.data;
}

export async function updatePost(id, data) {
  const response = await api.put(`/posts/${id}`, data);
  return response.data;
}

export async function deletePost(id) {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
}

export async function likePost(id) {
  const response = await api.post(`/posts/${id}/like`);
  return response.data;
}