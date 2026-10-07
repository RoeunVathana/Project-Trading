const { Category, Machine } = require("../models");
const { logError } = require("../middlewares/LogError");

const CATEGORY_FIELDS = ["name", "description", "status"];

const parseCategoryId = (value) => {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const parseCategoryPayload = (body, requireName = false) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object." };
  }

  const values = {};
  for (const field of CATEGORY_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) continue;
    const value = body[field];

    if (field === "name") {
      if (typeof value !== "string" || !value.trim()) {
        return { error: "name is required and must be a non-empty string." };
      }
      const name = value.trim();
      if (name.length > 100) return { error: "name cannot exceed 100 characters." };
      values.name = name;
      continue;
    }

    if (field === "description") {
      if (value !== null && typeof value !== "string") {
        return { error: "description must be a string or null." };
      }
      values.description = typeof value === "string" ? value.trim() : null;
      continue;
    }

    if (value !== "active" && value !== "inactive") {
      return { error: "status must be either active or inactive." };
    }
    values.status = value;
  }

  if (requireName && !Object.prototype.hasOwnProperty.call(values, "name")) {
    return { error: "name is required." };
  }
  if (Object.keys(values).length === 0) {
    return { error: "Provide at least one supported category field." };
  }

  return { values };
};

const getCategories = async (_req, res) => {
  try {
    const categories = await Category.findAll({ order: [["id", "DESC"]] });
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return logError("Category", error, res, "Unable to retrieve categories.");
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = parseCategoryId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "id must be a positive integer." });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return logError("Category", error, res, "Unable to retrieve the category.");
  }
};

const createCategory = async (req, res) => {
  try {
    const { values, error } = parseCategoryPayload(req.body, true);
    if (error) return res.status(400).json({ success: false, message: error });

    const existingCategory = await Category.findOne({ where: { name: values.name } });
    if (existingCategory) {
      return res.status(409).json({ success: false, message: "Category name already exists." });
    }

    const category = await Category.create(values);
    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    return logError("Category", error, res, "Unable to create the category.");
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = parseCategoryId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "id must be a positive integer." });
    }

    const { values, error } = parseCategoryPayload(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    if (values.name) {
      const existingCategory = await Category.findOne({ where: { name: values.name } });
      if (existingCategory && existingCategory.id !== category.id) {
        return res.status(409).json({ success: false, message: "Category name already exists." });
      }
    }

    await category.update(values);
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return logError("Category", error, res, "Unable to update the category.");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = parseCategoryId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "id must be a positive integer." });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    const machineCount = await Machine.count({ where: { categoryId: id } });
    if (machineCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete a category that is assigned to machines.",
      });
    }

    await category.destroy();
    return res.status(200).json({ success: true, message: "Category deleted." });
  } catch (error) {
    return logError("Category", error, res, "Unable to delete the category.");
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
