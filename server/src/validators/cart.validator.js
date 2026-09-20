export function validateAddCartItem(data) {
  const errors = {};

  if (!data.productId || typeof data.productId !== "string") {
    errors.productId = "Product ID is required";
  }

  if (
    data.quantity === undefined ||
    data.quantity === null ||
    data.quantity === ""
  ) {
    errors.quantity = "Quantity is required";
  } else if (
    !Number.isInteger(Number(data.quantity)) ||
    Number(data.quantity) < 1
  ) {
    errors.quantity = "Quantity must be a positive integer";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUpdateCartItem(data) {
  const errors = {};

  if (
    data.quantity === undefined ||
    data.quantity === null ||
    data.quantity === ""
  ) {
    errors.quantity = "Quantity is required";
  } else if (
    !Number.isInteger(Number(data.quantity)) ||
    Number(data.quantity) < 1
  ) {
    errors.quantity = "Quantity must be a positive integer";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}