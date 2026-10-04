const { Machine, MachinePdf } = require("../models");
const createCrudController = require("../utils/crudController");
const { getPdfMetadata, getPdfUrl, removePdf } = require("../utils/PdfUpload");

module.exports = createCrudController({
  model: MachinePdf,
  resourceName: "Machine PDF",
  uploadedFileFields: getPdfMetadata,
  removeUploadedFile: (file) => removePdf(getPdfUrl(file)),
  cleanupFileFields: ["filePath"],
  removeStoredFile: removePdf,
  parentModel: Machine,
  parentField: "machineId",
  requiredFields: ["machineId", "fileName", "filePath"],
  fields: {
    machineId: { type: "id" },
    fileName: { type: "string" },
    filePath: { type: "string" },
    fileSize: { type: "integer", min: 0, nullable: true },
  },
});
