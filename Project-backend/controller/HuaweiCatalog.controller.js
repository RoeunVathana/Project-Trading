const { Huawei, ProductImage, ProductPdf } = require("../models");
const createCrudController = require("../utils/crudController");
const { removeImage } = require("../utils/Upload");
const { getProductPdfMetadata, removePdf } = require("../utils/PdfUpload");

const productInclude = [{
  model: Huawei,
  as: "product",
  attributes: ["id", "productName", "modelCode", "slug"],
}];

const productFields = { productId: { type: "id" } };

const productImages = createCrudController({
  model: ProductImage,
  resourceName: "Huawei product image",
  parentModel: Huawei,
  parentField: "productId",
  parentResourceName: "Huawei product",
  include: productInclude,
  uploadedImageField: "imageUrl",
  cleanupFileFields: ["imageUrl"],
  removeStoredFile: removeImage,
  requiredFields: ["productId", "imageUrl"],
  fields: {
    ...productFields,
    imageUrl: { type: "string" },
    altText: { type: "string", nullable: true },
    description: { type: "string", nullable: true },
    isPrimary: { type: "boolean", nullable: true },
    displayOrder: { type: "integer", min: 0 },
  },
  order: [["displayOrder", "ASC"], ["id", "ASC"]],
});

const productPdfs = createCrudController({
  model: ProductPdf,
  resourceName: "Huawei product PDF",
  parentModel: Huawei,
  parentField: "productId",
  parentResourceName: "Huawei product",
  include: productInclude,
  uploadedFileFields: getProductPdfMetadata,
  removeUploadedFile: (file) => removePdf(`/pdf/${file.filename}`),
  cleanupFileFields: ["filePath"],
  removeStoredFile: removePdf,
  requiredFields: ["productId", "title", "originalFileName", "storedFileName", "filePath", "fileSizeBytes"],
  fields: {
    ...productFields,
    title: { type: "string" },
    description: { type: "string", nullable: true },
    originalFileName: { type: "string" },
    storedFileName: { type: "string" },
    filePath: { type: "string" },
    fileSizeBytes: { type: "integer", min: 0 },
    isPublished: { type: "boolean", nullable: true },
  },
  order: [["id", "DESC"]],
});

module.exports = { productImages, productPdfs };
