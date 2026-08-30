import { getFeed } from "../services/feed.service.js";

export async function getHomeFeed(req, res, next) {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      50
    );

    const result = await getFeed(
      req.user.id,
      page,
      limit
    );

    res.status(200).json({
      success: true,

      page: result.page,
      limit: result.limit,

      total: result.total,
      totalPages: result.totalPages,

      hasNextPage:
        page < result.totalPages,

      hasPreviousPage:
        page > 1,

      posts: result.posts,
    });
  } catch (error) {
    next(error);
  }
}