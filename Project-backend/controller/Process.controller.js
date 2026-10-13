const { Process } = require("../models");
const createCrudController = require("../utils/crudController");

module.exports = createCrudController({
  model: Process,
  resourceName: "Process",
  requiredFields: ["name"],
  fields: {
    name: { type: "string" },
    description: { type: "string", nullable: true },
    status: {
      type: "string",
      allowedValues: ["active", "inactive"],
    },
    sortOrder: { type: "integer", min: 0, nullable: true },
  },
  order: [["sortOrder", "ASC"], ["id", "ASC"]],
});
