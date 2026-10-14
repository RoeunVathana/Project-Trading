"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("machine_specs", "section", {
      type: Sequelize.STRING(160),
      allowNull: true,
    });
    await queryInterface.addColumn("machine_specs", "label", {
      type: Sequelize.STRING(160),
      allowNull: true,
    });
    await queryInterface.addColumn("machine_specs", "value", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("machine_specs", "sortOrder", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("machine_specs", "sortOrder");
    await queryInterface.removeColumn("machine_specs", "value");
    await queryInterface.removeColumn("machine_specs", "label");
    await queryInterface.removeColumn("machine_specs", "section");
  },
};
