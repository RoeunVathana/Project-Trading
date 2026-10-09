const { Machine, MachineSpec } = require("../models");
const createCrudController = require("../utils/crudController");

module.exports = createCrudController({
  model: MachineSpec,
  resourceName: "Machine specification",
  parentModel: Machine,
  parentField: "machineId",
  requiredFields: [
    "machineId",
    "frameVariation",
    "ratedCurrent",
    "voltage",
    "icuIcs",
    "poles",
    "mounting",
    "tripUnit",
  ],
  fields: {
    machineId: { type: "id" },
    specName: { type: "string", nullable: true },
    specValue: { type: "string", nullable: true },
    frameVariation: { type: "string" },
    ratedCurrent: { type: "string" },
    voltage: { type: "string" },
    icuIcs: { type: "string" },
    poles: { type: "string" },
    mounting: { type: "string" },
    tripUnit: { type: "string" },
  },
});
