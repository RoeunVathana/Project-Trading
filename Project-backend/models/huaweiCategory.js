"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HuaweiCategory extends Model {
    static associate(models) {
      HuaweiCategory.belongsTo(HuaweiCategory, { foreignKey: "parentId", as: "parent" });
      HuaweiCategory.hasMany(HuaweiCategory, { foreignKey: "parentId", as: "children" });
      HuaweiCategory.hasMany(models.Huawei, { foreignKey: "categoryId", as: "products" });
    }
  }

  HuaweiCategory.init({
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, field: "category_id" },
    parentId: { type: DataTypes.BIGINT, allowNull: true, field: "parent_id" },
    name: { type: DataTypes.STRING(150), allowNull: false },
    slug: { type: DataTypes.STRING(180), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    displayOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "display_order" },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_active" },
  }, { sequelize, modelName: "HuaweiCategory", tableName: "category_huawei", schema: "huawei_catalog", createdAt: "created_at", updatedAt: "updated_at" });

  return HuaweiCategory;
};
