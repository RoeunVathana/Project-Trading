"use strict";

const TABLE = { tableName: "product_images", schema: "huawei_catalog" };

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable(TABLE);
    if (!columns.description) {
      await queryInterface.addColumn(TABLE, "description", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const columns = await queryInterface.describeTable(TABLE);
    if (columns.description) await queryInterface.removeColumn(TABLE, "description");
  },
};
