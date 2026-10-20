"use strict";

const MACHINE_TABLE = "machines";
const CATEGORY_TABLE = "categories";

const readRows = async (queryInterface, Sequelize, tableName, transaction) => {
  const quotedTable = queryInterface.queryGenerator.quoteTable(tableName);
  return queryInterface.sequelize.query(`SELECT * FROM ${quotedTable}`, {
    type: Sequelize.QueryTypes.SELECT,
    transaction,
  });
};

const isFactoryRecord = (value) =>
  /cnc|mill|turn|lathe|factory|production/i.test(String(value || ""));

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const machineColumns = await queryInterface.describeTable(MACHINE_TABLE, { transaction });
      if (!machineColumns.division) {
        await queryInterface.addColumn(
          MACHINE_TABLE,
          "division",
          {
            type: Sequelize.STRING(32),
            allowNull: false,
            defaultValue: "chint",
          },
          { transaction },
        );
      }

      const categoryColumns = await queryInterface.describeTable(CATEGORY_TABLE, { transaction });
      if (!categoryColumns.division) {
        await queryInterface.addColumn(
          CATEGORY_TABLE,
          "division",
          {
            type: Sequelize.STRING(32),
            allowNull: false,
            defaultValue: "chint",
          },
          { transaction },
        );
      }

      const categories = await readRows(queryInterface, Sequelize, CATEGORY_TABLE, transaction);
      const categoryById = new Map(categories.map((category) => [Number(category.id), category]));

      const machines = await readRows(queryInterface, Sequelize, MACHINE_TABLE, transaction);
      for (const machine of machines) {
        const category = categoryById.get(Number(machine.categoryId));
        if (!isFactoryRecord(`${machine.machineType} ${category?.name}`)) continue;

        await queryInterface.bulkUpdate(
          MACHINE_TABLE,
          { division: "factory" },
          { id: machine.id },
          { transaction },
        );
      }

      for (const category of categories) {
        if (!isFactoryRecord(category.name)) continue;

        await queryInterface.bulkUpdate(
          CATEGORY_TABLE,
          { division: "factory" },
          { id: category.id },
          { transaction },
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const machineColumns = await queryInterface.describeTable(MACHINE_TABLE, { transaction });
      if (machineColumns.division) {
        await queryInterface.removeColumn(MACHINE_TABLE, "division", { transaction });
      }

      const categoryColumns = await queryInterface.describeTable(CATEGORY_TABLE, { transaction });
      if (categoryColumns.division) {
        await queryInterface.removeColumn(CATEGORY_TABLE, "division", { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
