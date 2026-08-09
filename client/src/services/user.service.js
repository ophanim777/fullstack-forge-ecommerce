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