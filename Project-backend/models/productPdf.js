"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductPdf extends Model {
    static associate(models) { ProductPdf.belongsTo(models.Huawei, { foreignKey: "productId", as: "product" }); }
  }
  ProductPdf.init({
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, field: "pdf_id" },
    productId: { type: DataTypes.BIGINT, allowNull: false, field: "product_id" },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    originalFileName: { type: DataTypes.STRING(255), allowNull: false, field: "original_file_name" },
    storedFileName: { type: DataTypes.STRING(255), allowNull: false, unique: true, field: "stored_file_name" },
    filePath: { type: DataTypes.STRING(1000), allowNull: false, field: "file_path" },
    fileSizeBytes: { type: DataTypes.BIGINT, allowNull: false, field: "file_size_bytes" },
    mimeType: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "application/pdf", field: "mime_type" },
    languageCode: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "en", field: "language_code" },
    isPublished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_published" },
    uploadedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: "uploaded_at" },
  }, { sequelize, modelName: "ProductPdf", tableName: "product_pdfs", schema: "huawei_catalog", timestamps: false });
  return ProductPdf;
};
