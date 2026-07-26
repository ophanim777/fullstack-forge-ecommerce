import { getFeed } from "../services/feed.service.js";

export async function getHomeFeed(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const posts = await getFeed(req.user.id, page,
      limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      posts,
    });
  } catch (error) {
    next(error);
  }
}