import { getProducts } from "../services/product.service.js";

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