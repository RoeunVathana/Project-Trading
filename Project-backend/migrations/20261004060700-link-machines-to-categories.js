"use strict";

const MACHINE_TABLE = "machines";
const CATEGORY_TABLE = "categories";

const getTableNames = async (queryInterface) => {
  const tables = await queryInterface.showAllTables();
  return tables.map((table) =>
    typeof table === "string" ? table : table.tableName || table.table_name,
  );
};

const selectRows = (queryInterface, Sequelize, tableName, transaction) => {
  const quotedTable = queryInterface.queryGenerator.quoteTable(tableName);
  return queryInterface.sequelize.query(`SELECT * FROM ${quotedTable}`, {
    type: Sequelize.QueryTypes.SELECT,
    transaction,
  });
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const tableNames = await getTableNames(queryInterface);
      let machineTable = tableNames.find((name) => name === MACHINE_TABLE);
      if (!machineTable) {
        machineTable = tableNames.find(
          (name) => name.toLowerCase() === MACHINE_TABLE,
        );
        if (!machineTable)
          throw new Error("The machines table does not exist.");
        await queryInterface.renameTable(machineTable, MACHINE_TABLE, {
          transaction,
        });
        machineTable = MACHINE_TABLE;
      }

      const columns = await queryInterface.describeTable(machineTable, {
        transaction,
      });
      if (columns.categoryId && !columns.category) {
        await transaction.commit();
        return;
      }
      if (!columns.category && !columns.categoryId) {
        throw new Error(
          "The machines table has neither category nor categoryId.",
        );
      }

      if (!columns.categoryId) {
        await queryInterface.addColumn(
          machineTable,
          "categoryId",
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: CATEGORY_TABLE, key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
          },
          { transaction },
        );
      }

      const machineRows = await selectRows(
        queryInterface,
        Sequelize,
        machineTable,
        transaction,
      );
      const categoryRows = await selectRows(
        queryInterface,
        Sequelize,
        CATEGORY_TABLE,
        transaction,
      );
      const categoryByName = new Map(
        categoryRows.map((category) => [
          category.name.trim().toLowerCase(),
          category.id,
        ]),
      );

      for (const machine of machineRows) {
        if (machine.categoryId) continue;
        const categoryName =
          typeof machine.category === "string" && machine.category.trim()
            ? machine.category.trim()
            : "Uncategorized";
        const normalizedName = categoryName.toLowerCase();
        let categoryId = categoryByName.get(normalizedName);

        if (!categoryId) {
          const now = new Date();
          await queryInterface.bulkInsert(
            CATEGORY_TABLE,
            [
              {
                name: categoryName,
                status: "active",
                createdAt: now,
                updatedAt: now,
              },
            ],
            { transaction },
          );
          const refreshedCategories = await selectRows(
            queryInterface,
            Sequelize,
            CATEGORY_TABLE,
            transaction,
          );
          const createdCategory = refreshedCategories.find(
            (category) => category.name.trim().toLowerCase() === normalizedName,
          );
          categoryId = createdCategory.id;
          categoryByName.set(normalizedName, categoryId);
        }

        await queryInterface.bulkUpdate(
          machineTable,
          { categoryId },
          { id: machine.id },
          { transaction },
        );
      }

      if (columns.category) {
        await queryInterface.removeColumn(machineTable, "category", {
          transaction,
        });
      }
      await queryInterface.changeColumn(
        machineTable,
        "categoryId",
        { type: Sequelize.INTEGER, allowNull: false },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const tableNames = await getTableNames(queryInterface);
      const machineTable = tableNames.find(
        (name) => name.toLowerCase() === MACHINE_TABLE,
      );
      if (!machineTable) throw new Error("The machines table does not exist.");

      const columns = await queryInterface.describeTable(machineTable, {
        transaction,
      });
      if (!columns.categoryId || columns.category) {
        await transaction.commit();
        return;
      }

      await queryInterface.addColumn(
        machineTable,
        "category",
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      );

      const machineRows = await selectRows(
        queryInterface,
        Sequelize,
        machineTable,
        transaction,
      );
      const categories = await selectRows(
        queryInterface,
        Sequelize,
        CATEGORY_TABLE,
        transaction,
      );
      const categoryNames = new Map(
        categories.map((category) => [category.id, category.name]),
      );

      for (const machine of machineRows) {
        await queryInterface.bulkUpdate(
          machineTable,
          {
            category: categoryNames.get(machine.categoryId) || "Uncategorized",
          },
          { id: machine.id },
          { transaction },
        );
      }

      await queryInterface.removeColumn(machineTable, "categoryId", {
        transaction,
      });
      await queryInterface.changeColumn(
        machineTable,
        "category",
        { type: Sequelize.STRING, allowNull: false },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
