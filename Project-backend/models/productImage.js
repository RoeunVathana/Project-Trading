"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) { ProductImage.belongsTo(models.Huawei, { foreignKey: "productId", as: "product" }); }
  }
  ProductImage.init({
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, field: "image_id" },
    productId: { type: DataTypes.BIGINT, allowNull: false, field: "product_id" },
    imageUrl: { type: DataTypes.STRING(1000), allowNull: false, field: "image_url" },
    altText: { type: DataTypes.STRING(255), allowNull: true, field: "alt_text" },
    description: { type: DataTypes.TEXT, allowNull: true },
    isPrimary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "is_primary" },
    displayOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "display_order" },
  }, { sequelize, modelName: "ProductImage", tableName: "product_images", schema: "huawei_catalog", createdAt: "created_at", updatedAt: false });
  return ProductImage;
};
