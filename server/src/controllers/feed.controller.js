import { getFeed } from "../services/feed.service.js";

export async function getHomeFeed(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getFeed(req.user.id, page,
      limit);

    res.status(200).json({
    success: true,
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit),
    hasNextPage: page < Math.ceil(result.total / limit),
    hasPreviousPage: page > 1,
    posts: result.posts,
});
  } catch (error) {
    next(error);
  }
}