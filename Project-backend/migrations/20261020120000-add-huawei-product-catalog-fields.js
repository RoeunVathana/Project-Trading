"use strict";

const TABLE = { tableName: "huawei", schema: "huawei_catalog" };

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable(TABLE);

    if (!columns.category_ids) {
      await queryInterface.addColumn(TABLE, "category_ids", {
        type: Sequelize.ARRAY(Sequelize.BIGINT),
        allowNull: false,
        defaultValue: [],
      });
    }

    if (!columns.base_image_url) {
      await queryInterface.addColumn(TABLE, "base_image_url", {
        type: Sequelize.STRING(1000),
        allowNull: true,
      });
    }

    await queryInterface.sequelize.query(`
      UPDATE "huawei_catalog"."huawei"
         SET "category_ids" = ARRAY["category_id"]::bigint[]
       WHERE "category_ids" IS NULL OR cardinality("category_ids") = 0
    `);
  },

  async down(queryInterface) {
    const columns = await queryInterface.describeTable(TABLE);
    if (columns.base_image_url) await queryInterface.removeColumn(TABLE, "base_image_url");
    if (columns.category_ids) await queryInterface.removeColumn(TABLE, "category_ids");
  },
};
