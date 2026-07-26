import { toggleFollow, getFollowers,
  getFollowing, } from "../services/follow.service.js";

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

export async function getFollowersByUser(req, res, next) {
  try {
    const followers = await getFollowers(req.params.id);

    res.status(200).json({
      success: true,
      count: followers.length,
      followers,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFollowingByUser(req, res, next) {
  try {
    const following = await getFollowing(req.params.id);

    res.status(200).json({
      success: true,
      count: following.length,
      following,
    });
  } catch (error) {
    next(error);
  }
}