import { toggleFollow } from "../services/follow.service.js";

export async function followUser(req, res, next) {
  try {
    const result = await toggleFollow(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: result.following
        ? "Berhasil mengikuti user."
        : "Berhasil berhenti mengikuti user.",
      following: result.following,
    });
  } catch (error) {
    next(error);
  }
}