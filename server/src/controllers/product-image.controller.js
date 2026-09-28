import {
  getProductImages,
  getProductImageById,
  createProductImage,
  deleteProductImage,
} from "../services/product-image.service.js";
import { createProductImageSchema } from "../validators/product-image.validator.js";

export async function getProductImagesController(req, res, next) {
  try {
    const images = await getProductImages(req.params.productId);

    res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductImageByIdController(req, res, next) {
  try {
    const image = await getProductImageById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Product image tidak ditemukan.",
      });
    }

    res.status(200).json({
      success: true,
      image,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProductImageController(req, res, next) {
  try {
    const body = createProductImageSchema.parse(req.body);

    const image = await createProductImage(
      body.productId,
      body.url
    );

    res.status(201).json({
      success: true,
      message: "Product image berhasil ditambahkan.",
      image,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductImageController(req, res, next) {
  try {
    const image = await getProductImageById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Product image tidak ditemukan.",
      });
    }

    await deleteProductImage(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product image berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
}