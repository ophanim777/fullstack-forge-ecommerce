export function validateCreateProduct(data) {
  const errors = {};

  if (!data.name || typeof data.name !== "string") {
    errors.name = "Product name is required";
  } else if (data.name.trim().length < 3) {
    errors.name = "Product name must be at least 3 characters";
  }

  if (!data.slug || typeof data.slug !== "string") {
    errors.slug = "Product slug is required";
  }

  if (!data.description || typeof data.description !== "string") {
    errors.description = "Product description is required";
  }

  if (data.price === undefined || data.price === null || data.price === "") {
    errors.price = "Product price is required";
  } else if (Number.isNaN(Number(data.price)) || Number(data.price) < 0) {
    errors.price = "Product price must be a valid positive number";
  }

  if (data.stock === undefined || data.stock === null || data.stock === "") {
    errors.stock = "Product stock is required";
  } else if (!Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) {
    errors.stock = "Product stock must be a non-negative integer";
  }

  if (!data.categoryId || typeof data.categoryId !== "string") {
    errors.categoryId = "Category ID is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUpdateProduct(data) {
  const errors = {};

  if (data.name !== undefined) {
    if (typeof data.name !== "string") {
      errors.name = "Product name must be a string";
    } else if (data.name.trim().length < 3) {
      errors.name = "Product name must be at least 3 characters";
    }
  }

  if (data.slug !== undefined) {
    if (typeof data.slug !== "string") {
      errors.slug = "Product slug must be a string";
    } else if (data.slug.trim().length < 3) {
      errors.slug = "Product slug must be at least 3 characters";
    }
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string") {
      errors.description = "Product description must be a string";
    } else if (data.description.trim().length === 0) {
      errors.description = "Product description cannot be empty";
    }
  }

  if (data.price !== undefined) {
    if (
      Number.isNaN(Number(data.price)) ||
      Number(data.price) < 0
    ) {
      errors.price = "Product price must be a non-negative number";
    }
  }

  if (data.stock !== undefined) {
    if (
      !Number.isInteger(Number(data.stock)) ||
      Number(data.stock) < 0
    ) {
      errors.stock = "Product stock must be a non-negative integer";
    }
  }

  if (data.categoryId !== undefined) {
    if (
      typeof data.categoryId !== "string" ||
      data.categoryId.trim().length === 0
    ) {
      errors.categoryId = "Category ID must be a valid string";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}