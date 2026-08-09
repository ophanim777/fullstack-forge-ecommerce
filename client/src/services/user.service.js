import api from "../api/axios";

export async function getUserProfile(username) {
  const response = await api.get(
    `/users/profile/${username}`
  );

  return response.data;
}

export async function updateProfile(data) {
  const response = await api.put(
    "/users/profile",
    data
  );

  return response.data;
}

export async function uploadAvatar(file) {
  const formData = new FormData();

  formData.append("avatar", file);

  const response = await api.post(
    "/users/avatar",
    formData
  );

  return response.data;
}

export async function toggleFollow(userId) {
  const response = await api.post(`/users/${userId}/follow`);

  return response.data;
}

export async function getFollowers(userId) {
  const response = await api.get(`/users/${userId}/followers`);

  return response.data;
}

export async function getFollowing(userId) {
  const response = await api.get(`/users/${userId}/following`);

  return response.data;
}