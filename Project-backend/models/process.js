const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Process extends Model {}

  Process.init(
    {
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
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

      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Process",
      tableName: "processes",
    },
  );

  return Process;
};
