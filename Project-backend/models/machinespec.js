const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MachineSpec extends Model {
    static associate(models) {
      MachineSpec.belongsTo(models.Machine, {
        foreignKey: "machineId",
        as: "machine",
      });
    }
  }

  MachineSpec.init(
    {
      machineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      specName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      specValue: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MachineSpec",
      tableName: "machine_specs",
    },
  );

  return MachineSpec;
};
