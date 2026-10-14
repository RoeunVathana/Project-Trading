const { Machine, MachineSpec } = require("../models");
const createCrudController = require("../utils/crudController");

module.exports = createCrudController({
  model: MachineSpec,
  resourceName: "Machine specification",
  parentModel: Machine,
  parentField: "machineId",
  requiredFields: [
    "machineId",
    "section",
    "value",
  ],
  fields: {
    machineId: { type: "id" },
    section: { type: "string" },
    label: { type: "string", nullable: true },
    value: { type: "string" },
    sortOrder: { type: "integer", min: 0 },
    specName: { type: "string", nullable: true },
    specValue: { type: "string", nullable: true },
    frameVariation: { type: "string", nullable: true },
    ratedCurrent: { type: "string", nullable: true },
    voltage: { type: "string", nullable: true },
    icuIcs: { type: "string", nullable: true },
    poles: { type: "string", nullable: true },
    mounting: { type: "string", nullable: true },
    tripUnit: { type: "string", nullable: true },
  },
  order: [
    ["sortOrder", "ASC"],
    ["id", "ASC"],
  ],
});
