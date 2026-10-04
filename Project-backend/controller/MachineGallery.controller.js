const { Machine, MachineGallery } = require("../models");
const createCrudController = require("../utils/crudController");
const { removeImage } = require("../utils/Upload");

module.exports = createCrudController({
  model: MachineGallery,
  resourceName: "Machine gallery item",
  uploadedImageField: "imageUrl",
  cleanupFileFields: ["imageUrl"],
  removeStoredFile: removeImage,
  parentModel: Machine,
  parentField: "machineId",
  requiredFields: ["machineId", "imageUrl"],
  fields: {
    machineId: { type: "id" },
    imageUrl: { type: "string" },
    sortOrder: { type: "integer", min: 0, nullable: true },
  },
});
