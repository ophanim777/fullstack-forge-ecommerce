import {
  getReviewsByProductId,
  getReviewById,
  createReview,
} from "../services/review.service.js";

import {
  validateCreateReview,
} from "../validators/review.validator.js";

export async function getReviewsByProductController(
  req,
  res,
  next
) {
  try {
    const reviews = await getReviewsByProductId(
      req.params.productId
    );

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReviewByIdController(
  req,
  res,
  next
) {
  try {
    const review = await getReviewById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review tidak ditemukan.",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
}

export async function createReviewController(
  req,
  res,
  next
) {
  try {
    const { isValid, errors } =
      validateCreateReview(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const review = await createReview(
      req.user.id,
      req.body.productId,
      Number(req.body.rating),
      req.body.comment
    );

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    if (error.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan.",
      });
    }

    if (error.message === "REVIEW_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "User sudah memberikan review untuk product ini.",
      });
    }

    next(error);
  }
}