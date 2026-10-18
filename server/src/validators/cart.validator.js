
function validateBody(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {
      isValid: false,
      errors: {
        body: "Request body harus berupa object.",
      },
    };
  }

  return null;
}

function validateQuantity(quantity, errors, required = true) {
  if (quantity === undefined && !required) {
    return;
  }

  if (
    !Number.isSafeInteger(Number(quantity)) ||
    quantity === null ||
    (typeof quantity === "string" && quantity.trim() === "") ||
    Number(quantity) < 1
  ) {
    errors.quantity = "Jumlah produk harus berupa bilangan bulat minimal 1.";
  }
}

export function validateAddCartItem(data) {
  const bodyError = validateBody(data);

  if (bodyError) return bodyError;

  const errors = {};

  if (
    typeof data.productId !== "string" ||
    data.productId.trim().length === 0
  ) {
    errors.productId = "Product ID wajib diisi.";
  }

  validateQuantity(data.quantity, errors, false);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUpdateCartItem(data) {
  const bodyError = validateBody(data);

  if (bodyError) return bodyError;

  const errors = {};

  validateQuantity(data.quantity, errors, true);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
