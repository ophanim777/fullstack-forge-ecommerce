
function validateProductFields(data, isUpdate = false) {
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
    ![
      "name",
      "slug",
      "description",
      "price",
      "stock",
      "categoryId",
    ].some((field) => data[field] !== undefined)
  ) {
    errors.body = "Minimal satu field harus diperbarui.";
  }

  if (!isUpdate || data.name !== undefined) {
    if (typeof data.name !== "string") {
      errors.name = "Nama produk wajib berupa teks.";
    } else if (data.name.trim().length < 3) {
      errors.name = "Nama produk minimal 3 karakter.";
    } else if (data.name.trim().length > 150) {
      errors.name = "Nama produk maksimal 150 karakter.";
    }
  }

  if (!isUpdate || data.slug !== undefined) {
    if (typeof data.slug !== "string") {
      errors.slug = "Slug produk wajib berupa teks.";
    } else if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug.trim())
    ) {
      errors.slug =
        "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.";
    } else if (data.slug.trim().length < 3) {
      errors.slug = "Slug produk minimal 3 karakter.";
    } else if (data.slug.trim().length > 150) {
      errors.slug = "Slug produk maksimal 150 karakter.";
    }
  }

  if (!isUpdate || data.description !== undefined) {
    if (typeof data.description !== "string") {
      errors.description = "Deskripsi produk wajib berupa teks.";
    } else if (data.description.trim().length === 0) {
      errors.description = "Deskripsi produk tidak boleh kosong.";
    } else if (data.description.trim().length > 5000) {
      errors.description = "Deskripsi produk maksimal 5000 karakter.";
    }
  }

  if (!isUpdate || data.price !== undefined) {
    const price = data.price;

    if (
      price === undefined ||
      price === null ||
      (typeof price === "string" && price.trim() === "")
    ) {
      errors.price = "Harga produk wajib diisi.";
    } else if (
      !["number", "string"].includes(typeof price) ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      errors.price = "Harga harus berupa angka non-negatif yang valid.";
    }
  }

  if (!isUpdate || data.stock !== undefined) {
    const stock = data.stock;

    if (
      stock === undefined ||
      stock === null ||
      (typeof stock === "string" && stock.trim() === "")
    ) {
      errors.stock = "Stok produk wajib diisi.";
    } else if (
      !["number", "string"].includes(typeof stock) ||
      !Number.isSafeInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      errors.stock = "Stok harus berupa bilangan bulat non-negatif.";
    }
  }

  if (!isUpdate || data.categoryId !== undefined) {
    if (
      typeof data.categoryId !== "string" ||
      data.categoryId.trim().length === 0
    ) {
      errors.categoryId = "Category ID wajib diisi.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCreateProduct(data) {
  return validateProductFields(data);
}

export function validateUpdateProduct(data) {
  return validateProductFields(data, true);
}
