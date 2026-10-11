import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";

import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../validators/product.validator.js";

export async function getProductsController(req, res, next) {
  try {
    const products = await getProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductByIdController(req, res, next) {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProductController(req, res, next) {
  const validation = validateCreateProduct(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors,
    });
  }

  try {
    const product = await createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Produk berhasil dibuat.",
      product,
    });
  } catch (error) {
    if (error.message === "PRODUCT_SLUG_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Slug produk sudah digunakan.",
      });
    }

    if (error.message === "PRODUCT_CATEGORY_NOT_FOUND") {
      return res.status(400).json({
        success: false,
        message: "Kategori produk tidak ditemukan.",
      });
    }

    return next(error);
  }
}

export async function updateProductController(req, res, next) {
  const validation = validateUpdateProduct(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors,
    });
  }

  try {
    const product = await updateProduct(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Produk berhasil diperbarui.",
      product,
    });
  } catch (error) {
    if (error.message === "PRODUCT_SLUG_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Slug produk sudah digunakan.",
      });
    }

    if (error.message === "PRODUCT_CATEGORY_NOT_FOUND") {
      return res.status(400).json({
        success: false,
        message: "Kategori produk tidak ditemukan.",
      });
    }

    if (error.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan.",
      });
    }

    return next(error);
  }
}

export async function deleteProductController(req, res, next) {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan.",
      });
    }

    await deleteProduct(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Produk berhasil dihapus.",
    });
  } catch (error) {
    return next(error);
  }
}