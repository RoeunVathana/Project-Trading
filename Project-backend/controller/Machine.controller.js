const {
  Machine,
  MachineGallery,
  MachineSpec,
  Category,
} = require("../models");
const { Op, col, fn, where } = require("sequelize");
const { getImageUrl, removeImage } = require("../utils/Upload");
const { logError } = require("../middlewares/LogError");

const MACHINE_FIELDS = [
  "name",
  "model",
  "categoryId",
  "image",
  "badge",
  "machineType",
  "power",
  "precision",
  "availability",
];

const REQUIRED_FIELDS = ["name", "model", "categoryId"];
const REQUIRED_STRING_FIELDS = ["name", "model"];
const MACHINE_PAGE_SIZE = 10;

const categoryAssociation = () => ({
  model: Category,
  as: "category",
  attributes: ["id", "name", "description", "status"],
});

const machineIncludes = () => [
  categoryAssociation(),
  {
    model: MachineGallery,
    as: "gallery",
    separate: true,
    order: [["id", "DESC"]],
  },
  {
    model: MachineSpec,
    as: "specs",
    separate: true,
    order: [["id", "DESC"]],
  },
];

const getMachineBody = (req) => {
  const body = { ...(req.body || {}) };
  if (req.file) body.image = getImageUrl(req.file);
  return body;
};

const discardUploadedImage = (req) => {
  if (req.file) removeImage(getImageUrl(req.file));
};

const parseMachineId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const parseMachinePayload = (body, requireRequiredFields = false) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object." };
  }

  const values = {};

  for (const field of MACHINE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) continue;

    const value = body[field];
    if (field === "categoryId") {
      const categoryId = parseMachineId(value);
      if (!categoryId) {
        return { error: "categoryId must be a positive integer." };
      }
      values.categoryId = categoryId;
      continue;
    }

    if (value === null && !REQUIRED_STRING_FIELDS.includes(field)) {
      values[field] = null;
      continue;
    }

    if (typeof value !== "string") {
      return {
        error: `${field} must be a string${REQUIRED_STRING_FIELDS.includes(field) ? "" : " or null"}.`,
      };
    }

    const trimmedValue = value.trim();
    if (REQUIRED_STRING_FIELDS.includes(field) && !trimmedValue) {
      return { error: `${field} is required.` };
    }

    values[field] = trimmedValue;
  }

  if (requireRequiredFields) {
    for (const field of REQUIRED_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(values, field)) {
        return { error: `${field} is required.` };
      }
    }
  }

  if (Object.keys(values).length === 0) {
    return { error: "Provide at least one supported machine field." };
  }

  return { values };
};

const handleDatabaseError = (res, message, error) => {
  return logError("Machine", error, res, message);
};

const getMachines = async (req, res) => {
  try {
    const pageValue = req.query.page === undefined ? "1" : req.query.page;
    const page = Number(pageValue);
    if (!Number.isSafeInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "page must be a positive integer.",
      });
    }

    const filters = [];
    const queryFields = ["name", "model"];

    for (const field of queryFields) {
      const queryValue = req.query[field];
      if (queryValue === undefined || queryValue === "") continue;

      if (typeof queryValue !== "string") {
        return res.status(400).json({
          success: false,
          message: `The ${field} filter must be a string.`,
        });
      }

      const normalizedValue = queryValue.trim().toLowerCase();
      if (!normalizedValue) continue;

      const column = col(field);
      if (field === "category") {
        filters.push(where(fn("LOWER", column), normalizedValue));
      } else {
        filters.push(
          where(fn("LOWER", column), {
            [Op.like]: `%${normalizedValue}%`,
          }),
        );
      }
    }

    const categoryFilters = [];
    const categoryName = req.query.category;
    if (categoryName !== undefined && categoryName !== "") {
      if (typeof categoryName !== "string") {
        return res.status(400).json({
          success: false,
          message: "The category filter must be a string.",
        });
      }

      const normalizedCategory = categoryName.trim().toLowerCase();
      if (normalizedCategory) {
        categoryFilters.push(
          where(fn("LOWER", col("category.name")), normalizedCategory),
        );
      }
    }

    const categoryId = req.query.categoryId;
    if (categoryId !== undefined && categoryId !== "") {
      const parsedCategoryId = parseMachineId(categoryId);
      if (!parsedCategoryId) {
        return res.status(400).json({
          success: false,
          message: "categoryId must be a positive integer.",
        });
      }
      filters.push({ categoryId: parsedCategoryId });
    }

    const includes = machineIncludes();
    const categoryInclude = includes[0];
    if (categoryFilters.length) {
      categoryInclude.required = true;
      categoryInclude.where = { [Op.and]: categoryFilters };
    }

    const { count, rows: machines } = await Machine.findAndCountAll({
      where: filters.length ? { [Op.and]: filters } : undefined,
      include: includes,
      order: [["id", "DESC"]],
      limit: MACHINE_PAGE_SIZE,
      offset: (page - 1) * MACHINE_PAGE_SIZE,
      distinct: true,
    });
    return res.status(200).json({
      success: true,
      data: machines,
      pagination: {
        currentPage: page,
        pageSize: MACHINE_PAGE_SIZE,
        totalItems: count,
        totalPages: Math.ceil(count / MACHINE_PAGE_SIZE),
      },
    });
  } catch (error) {
    return handleDatabaseError(res, "Unable to retrieve machines.", error);
  }
};

const getMachineById = async (req, res) => {
  try {
    const id = parseMachineId(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Machine id must be a positive integer.",
      });
    }

    const machine = await Machine.findByPk(id, {
      include: machineIncludes(),
    });
    if (!machine) {
      return res
        .status(404)
        .json({ success: false, message: "Machine not found." });
    }

    return res.status(200).json({ success: true, data: machine });
  } catch (error) {
    return handleDatabaseError(res, "Unable to retrieve the machine.", error);
  }
};

const createMachine = async (req, res) => {
  try {
    const { values, error } = parseMachinePayload(getMachineBody(req), true);
    if (error) {
      discardUploadedImage(req);
      return res.status(400).json({ success: false, message: error });
    }

    const category = await Category.findByPk(values.categoryId);
    if (!category) {
      discardUploadedImage(req);
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    const machine = await Machine.create(values);
    await machine.reload({ include: machineIncludes() });
    return res.status(201).json({ success: true, data: machine });
  } catch (error) {
    discardUploadedImage(req);
    return handleDatabaseError(
      res,
      "Unable to create the machine.",
      error,
    );
  }
};

const updateMachine = async (req, res) => {
  try {
    const id = parseMachineId(req.params.id);
    if (!id) {
      discardUploadedImage(req);
      return res.status(400).json({
        success: false,
        message: "Machine id must be a positive integer.",
      });
    }

    const { values, error } = parseMachinePayload(getMachineBody(req));
    if (error) {
      discardUploadedImage(req);
      return res.status(400).json({ success: false, message: error });
    }

    const machine = await Machine.findByPk(id);
    if (!machine) {
      discardUploadedImage(req);
      return res
        .status(404)
        .json({ success: false, message: "Machine not found." });
    }

    if (Object.prototype.hasOwnProperty.call(values, "categoryId")) {
      const category = await Category.findByPk(values.categoryId);
      if (!category) {
        discardUploadedImage(req);
        return res.status(404).json({ success: false, message: "Category not found." });
      }
    }

    const previousImage = machine.image;
    await machine.update(values);
    await machine.reload({ include: machineIncludes() });
    if (previousImage && previousImage !== machine.image) {
      removeImage(previousImage);
    }
    return res.status(200).json({ success: true, data: machine });
  } catch (error) {
    discardUploadedImage(req);
    return handleDatabaseError(
      res,
      "Unable to update the machine.",
      error,
    );
  }
};

const deleteMachine = async (req, res) => {
  try {
    const id = parseMachineId(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Machine id must be a positive integer.",
      });
    }

    const machine = await Machine.findByPk(id);
    if (!machine) {
      return res
        .status(404)
        .json({ success: false, message: "Machine not found." });
    }

    const galleryItems = await MachineGallery.findAll({
      where: { machineId: machine.id },
      attributes: ["imageUrl"],
    });
    await machine.destroy();
    removeImage(machine.image);
    galleryItems.forEach((item) => removeImage(item.imageUrl));
    return res.status(200).json({ success: true, message: "Machine deleted." });
  } catch (error) {
    return handleDatabaseError(res, "Unable to delete the machine.", error);
  }
};

module.exports = {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
};
