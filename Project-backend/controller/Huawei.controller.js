const { Huawei, HuaweiCategory } = require("../models");
const createCrudController = require("../utils/crudController");

module.exports = createCrudController({
  model: Huawei,
  resourceName: "Huawei product",
  parentModel: HuaweiCategory,
  parentField: "categoryId",
  parentResourceName: "Huawei category",
  include: [{ model: HuaweiCategory, as: "category", attributes: ["id", "name", "slug"] }],
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
