const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MachineGallery extends Model {
    static associate(models) {
      MachineGallery.belongsTo(models.Machine, {
        foreignKey: "machineId",
        as: "machine",
      });
    }
  }

  MachineGallery.init(
    {
      machineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "MachineGallery",
      tableName: "machine_galleries",
    },
  );

  return MachineGallery;
};
