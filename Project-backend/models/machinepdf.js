const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MachinePdf extends Model {
    static associate(models) {
      MachinePdf.belongsTo(models.Machine, {
        foreignKey: "machineId",
        as: "machine",
      });
    }
  }

  MachinePdf.init(
    {
      machineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "MachinePdf",
      tableName: "machine_pdfs",
    }
  );

  return MachinePdf;
};