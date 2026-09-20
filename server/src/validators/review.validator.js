export function validateCreateReview(data) {
  const errors = {};

  if (!data.productId || typeof data.productId !== "string") {
    errors.productId = "Product ID is required";
  }

  if (
    data.rating === undefined ||
    data.rating === null ||
    data.rating === ""
  ) {
    errors.rating = "Rating is required";
  } else if (
    !Number.isInteger(Number(data.rating)) ||
    Number(data.rating) < 1 ||
    Number(data.rating) > 5
  ) {
    errors.rating = "Rating must be an integer between 1 and 5";
  }

  if (data.comment !== undefined && data.comment !== null) {
    if (typeof data.comment !== "string") {
      errors.comment = "Comment must be a string";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}