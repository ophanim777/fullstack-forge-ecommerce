import { createCommentSchema } from "../validators/comment.validator.js";
import { createComment as createCommentService, getComments, } from "../services/comment.service.js";

export async function createComment(req, res, next) {
  try {
    const body = createCommentSchema.parse(req.body);

    const comment = await createCommentService(
      req.params.id,
      req.user.id,
      body
    );

    res.status(201).json({
      success: true,
      message: "Komentar berhasil dibuat.",
      comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCommentsByPost(req, res, next) {
  try {
    const comments = await getComments(req.params.id);

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    next(error);
  }
}