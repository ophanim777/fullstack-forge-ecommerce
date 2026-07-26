import { getFeed } from "../services/feed.service.js";

export async function getHomeFeed(req, res, next) {
  try {
    const posts = await getFeed(req.user.id);

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
}