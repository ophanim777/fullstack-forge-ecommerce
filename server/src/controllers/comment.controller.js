import { createCommentSchema } from "../validators/comment.validator.js";
import { createComment as createCommentService } from "../services/comment.service.js";

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