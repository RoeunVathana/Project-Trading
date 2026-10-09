const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Machine extends Model {
    static associate(models) {
      Machine.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      });

      Machine.hasMany(models.MachineGallery, {
        foreignKey: "machineId",
        as: "gallery",
        onDelete: "CASCADE",
      });

      Machine.hasMany(models.MachineSpec, {
        foreignKey: "machineId",
        as: "specs",
        onDelete: "CASCADE",
      });

      Machine.hasMany(models.MachinePdf, {
        foreignKey: "machineId",
        as: "pdfs",
        onDelete: "CASCADE",
      });
    }
  }

  Machine.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      model: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      image: {
        type: DataTypes.STRING,
      },

      video: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      badge: {
        type: DataTypes.STRING,
      },

      machineType: {
        type: DataTypes.STRING,
      },

      power: {
        type: DataTypes.STRING,
      },

      precision: {
        type: DataTypes.STRING,
      },

      availability: {
        type: DataTypes.STRING,
      },

      viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

    },
    {
      sequelize,
      modelName: "Machine",
      tableName: "machines",
    },
  );

  return Machine;
};
