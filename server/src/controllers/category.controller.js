import { getCategories, getCategoryById, createCategory, } from "../services/category.service.js";
import {
  validateCreateCategory,
} from "../validators/category.validator.js";


export async function getCategoriesController(req, res, next) {
  try {
    const categories = await getCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryByIdController(req, res, next) {
  try {
    const category = await getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category tidak ditemukan.",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}


export async function createCategoryController(req, res, next) {
  try {
    const { isValid, errors } = validateCreateCategory(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const category = await createCategory(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
}