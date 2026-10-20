const { HuaweiCategory } = require("../models");
const createCrudController = require("../utils/crudController");

module.exports = createCrudController({
  model: HuaweiCategory,
  resourceName: "Huawei category",
  parentModel: HuaweiCategory,
  parentField: "parentId",
  parentResourceName: "Huawei parent category",
  include: [{ model: HuaweiCategory, as: "parent", attributes: ["id", "name", "slug"] }],
  requiredFields: ["name", "slug"],
  fields: {
    parentId: { type: "id", nullable: true },
    name: { type: "string" },
    slug: { type: "string" },
    description: { type: "string", nullable: true },
    displayOrder: { type: "integer", min: 0 },
    isActive: { type: "boolean", nullable: true },
  },
  order: [["parentId", "ASC"], ["displayOrder", "ASC"], ["id", "ASC"]],
});
