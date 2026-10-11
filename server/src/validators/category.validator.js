
function validateCategoryFields(data, isUpdate = false) {
  const errors = {};

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    return {
      isValid: false,
      errors: {
        body: "Request body harus berupa object.",
      },
    };
  }

  if (
    isUpdate &&
    data.name === undefined &&
    data.slug === undefined
  ) {
    errors.body = "Minimal satu field harus diperbarui.";
  }

  if (!isUpdate || data.name !== undefined) {
    if (typeof data.name !== "string") {
      errors.name = "Category name harus berupa teks.";
    } else if (data.name.trim().length < 3) {
      errors.name = "Category name minimal 3 karakter.";
    } else if (data.name.trim().length > 100) {
      errors.name = "Category name maksimal 100 karakter.";
    }
  }

  if (!isUpdate || data.slug !== undefined) {
    if (typeof data.slug !== "string") {
      errors.slug = "Category slug harus berupa teks.";
    } else if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug.trim())
    ) {
      errors.slug =
        "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.";
    } else if (data.slug.trim().length < 3) {
      errors.slug = "Category slug minimal 3 karakter.";
    } else if (data.slug.trim().length > 100) {
      errors.slug = "Category slug maksimal 100 karakter.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCreateCategory(data) {
  return validateCategoryFields(data);
}

export function validateUpdateCategory(data) {
  return validateCategoryFields(data, true);
}
