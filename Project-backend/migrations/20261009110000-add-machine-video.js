"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("machines", "video", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("machines", "video");
  },
};
