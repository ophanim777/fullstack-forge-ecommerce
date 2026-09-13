import { 
    getCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory, } from "../services/category.service.js";

import {
  validateCreateCategory,
  validateUpdateCategory,
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
    if (error.message === "CATEGORY_SLUG_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Category slug sudah digunakan.",
      });
    }

    next(error);
  }
}

export async function updateCategoryController(req, res, next) {
  try {
    const { isValid, errors } = validateUpdateCategory(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const existingCategory = await getCategoryById(req.params.id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category tidak ditemukan.",
      });
    }

    const category = await updateCategory(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error.message === "CATEGORY_SLUG_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Category slug sudah digunakan.",
      });
    }

    next(error);
  }
}

export async function deleteCategoryController(req, res, next) {
  try {
    const category = await getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category tidak ditemukan.",
      });
    }

    await deleteCategory(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
}