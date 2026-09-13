export function validateCreateCategory(data) {
  const errors = {};

  if (!data.name || typeof data.name !== "string") {
    errors.name = "Category name is required";
  } else if (data.name.trim().length < 3) {
    errors.name = "Category name must be at least 3 characters";
  }

  if (!data.slug || typeof data.slug !== "string") {
    errors.slug = "Category slug is required";
  } else if (data.slug.trim().length < 3) {
    errors.slug = "Category slug must be at least 3 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUpdateCategory(data) {
  const errors = {};

  if (data.name !== undefined) {
    if (typeof data.name !== "string") {
      errors.name = "Category name must be a string";
    } else if (data.name.trim().length < 3) {
      errors.name = "Category name must be at least 3 characters";
    }
  }

  if (data.slug !== undefined) {
    if (typeof data.slug !== "string") {
      errors.slug = "Category slug must be a string";
    } else if (data.slug.trim().length < 3) {
      errors.slug = "Category slug must be at least 3 characters";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}