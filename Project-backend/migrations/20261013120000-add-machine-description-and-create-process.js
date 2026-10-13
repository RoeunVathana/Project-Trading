"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const machineColumns = await queryInterface.describeTable("machines");
    if (!machineColumns.description) {
      await queryInterface.addColumn("machines", "description", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    const tables = await queryInterface.showAllTables();
    const hasProcessesTable = tables.some((table) => {
      const tableName = typeof table === "string" ? table : table.tableName;
      return String(tableName).toLowerCase() === "processes";
    });

    if (hasProcessesTable) return;

    await queryInterface.createTable("processes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    const tables = await queryInterface.showAllTables();
    const hasProcessesTable = tables.some((table) => {
      const tableName = typeof table === "string" ? table : table.tableName;
      return String(tableName).toLowerCase() === "processes";
    });
    if (hasProcessesTable) await queryInterface.dropTable("processes");
    if (queryInterface.sequelize.getDialect() === "postgres") {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_processes_status";',
      );
    }
    const machineColumns = await queryInterface.describeTable("machines");
    if (machineColumns.description) {
      await queryInterface.removeColumn("machines", "description");
    }
  },
};
