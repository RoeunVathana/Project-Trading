const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Machine, {
        foreignKey: "categoryId",
        as: "machines",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
    },
  );

  return Category;
};
