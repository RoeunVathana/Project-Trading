const { Huawei, HuaweiCategory } = require("../models");
const createCrudController = require("../utils/crudController");

const include = [{ model: HuaweiCategory, as: "category", attributes: ["id", "name", "slug"] }];

module.exports = createCrudController({
  model: Huawei,
  resourceName: "Huawei product",
  parentModel: HuaweiCategory,
  parentField: "categoryId",
  parentResourceName: "Huawei category",
  include,
  requiredFields: ["categoryId", "modelCode", "productName", "slug"],
  fields: {
    categoryId: { type: "id" },
    brandName: { type: "string", nullable: true },
    modelCode: { type: "string" },
    productName: { type: "string" },
    slug: { type: "string" },
    shortDescription: { type: "string", nullable: true },
    description: { type: "string", nullable: true },
    status: { type: "string", allowedValues: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
    displayOrder: { type: "integer", min: 0 },
  },
  order: [["displayOrder", "ASC"], ["id", "DESC"]],
});

const defaultGetById = module.exports.getById;

module.exports.getById = async (req, res) => {
  const routeValue = String(req.params.id || "").trim();

  if (/^\d+$/.test(routeValue)) {
    return defaultGetById(req, res);
  }

  try {
    const category = await HuaweiCategory.findOne({ where: { slug: routeValue } });
    if (!category) {
      return res.status(404).json({ success: false, message: "Huawei product category not found." });
    }

    const record = await Huawei.findOne({
      where: { categoryId: category.id, status: "PUBLISHED" },
      include,
      order: [["displayOrder", "ASC"], ["id", "ASC"]],
    });

    if (!record) {
      return res.status(404).json({ success: false, message: "No published Huawei product was found in this category." });
    }

    return res.status(200).json({ success: true, data: record });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Unable to retrieve Huawei product." });
  }
};
