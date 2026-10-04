const { Machine, MachineSpec } = require("../models");
const createCrudController = require("../utils/crudController");

module.exports = createCrudController({
  model: MachineSpec,
  resourceName: "Machine specification",
  parentModel: Machine,
  parentField: "machineId",
  requiredFields: ["machineId", "specName", "specValue"],
  fields: {
    machineId: { type: "id" },
    specName: { type: "string" },
    specValue: { type: "string" },
  },
});
