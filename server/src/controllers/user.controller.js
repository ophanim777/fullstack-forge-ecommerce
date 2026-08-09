import { updateProfileSchema } from "../validators/user.validator.js";
import { updateProfile } from "../services/user.service.js";
import { updateAvatar } from "../services/user.service.js";
import { getProfileByUsername, } from "../services/user.service.js";

export async function updateUserProfile(req, res, next) {
  try {
    const body = updateProfileSchema.parse(req.body);

    const user = await updateProfile(
      req.user.id,
      body
    );

    res.status(200).json({
      success: true,
      message: "Profile berhasil diperbarui.",
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File avatar wajib diupload.",
      });
    }

    const avatarPath = `/uploads/${req.file.filename}`;

    const user = await updateAvatar(req.user.id, avatarPath);

    res.status(200).json({
      success: true,
      message: "Avatar berhasil diupload.",
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserProfile(req, res, next) {
  try {
    const user = await getProfileByUsername(
      req.params.username
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}