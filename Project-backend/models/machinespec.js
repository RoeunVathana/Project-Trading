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
        allowNull: true,
      },

      specValue: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      frameVariation: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      ratedCurrent: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      voltage: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      icuIcs: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      poles: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      mounting: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      tripUnit: {
        type: DataTypes.STRING,
        allowNull: true,
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
