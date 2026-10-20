"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Huawei extends Model {
    static associate(models) {
      Huawei.belongsTo(models.HuaweiCategory, { foreignKey: "categoryId", as: "category" });
      Huawei.hasMany(models.ProductImage, { foreignKey: "productId", as: "images" });
      Huawei.hasMany(models.ProductPdf, { foreignKey: "productId", as: "pdfs" });
    }
  }

  Huawei.init({
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, field: "product_id" },
    categoryId: { type: DataTypes.BIGINT, allowNull: false, field: "category_id" },
    categoryIds: { type: DataTypes.ARRAY(DataTypes.BIGINT), allowNull: false, defaultValue: [], field: "category_ids" },
    brandName: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "Huawei", field: "brand_name" },
    modelCode: { type: DataTypes.STRING(150), allowNull: false, unique: true, field: "model_code" },
    productName: { type: DataTypes.STRING(200), allowNull: false, field: "product_name" },
    slug: { type: DataTypes.STRING(220), allowNull: false, unique: true },
    shortDescription: { type: DataTypes.STRING(500), allowNull: true, field: "short_description" },
    description: { type: DataTypes.TEXT, allowNull: true },
    baseImageUrl: { type: DataTypes.STRING(1000), allowNull: true, field: "base_image_url" },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "PUBLISHED" },
    displayOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "display_order" },
  }, { sequelize, modelName: "Huawei", tableName: "huawei", schema: "huawei_catalog", createdAt: "created_at", updatedAt: "updated_at" });

  return Huawei;
};
