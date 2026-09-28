import { getProducts, createProduct, getProductById, updateProduct, deleteProduct, } from "../services/product.service.js";
import { validateCreateProduct, validateUpdateProduct, } from "../validators/product.validator.js";


export async function getProductsController(req, res, next) {
  try {
    const products = await getProducts();

    res.status(200).json({
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
        message: "Product tidak ditemukan.",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProductController(req, res, next) {
  try {
    const body = createProductSchema.parse(req.body);

    const product = await createProduct(body);

    res.status(201).json({
      success: true,
      message: "Product berhasil dibuat.",
      product,
    });
  } catch (error) {
    if (error.message === "PRODUCT_SLUG_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Slug product sudah digunakan.",
      });
    }

    next(error);
  }
}

export async function updateProductController(req, res, next) {
  try {
    const body = updateProductSchema.parse(req.body);

    const product = await updateProduct(
      req.params.id,
      body
    );

    res.status(200).json({
      success: true,
      message: "Product berhasil diperbarui.",
      product,
    });
  } catch (error) {
    if (error.message === "PRODUCT_SLUG_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Slug product sudah digunakan.",
      });
    }

    next(error);
  }
}

export async function deleteProductController(req, res, next) {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan.",
      });
    }

    await deleteProduct(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
}