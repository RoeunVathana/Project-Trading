module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = [
      "frameVariation",
      "ratedCurrent",
      "voltage",
      "icuIcs",
      "poles",
      "mounting",
      "tripUnit",
    ];

    for (const column of columns) {
      await queryInterface.addColumn("machine_specs", column, {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    await queryInterface.changeColumn("machine_specs", "specName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("machine_specs", "specValue", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    const columns = [
      "frameVariation",
      "ratedCurrent",
      "voltage",
      "icuIcs",
      "poles",
      "mounting",
      "tripUnit",
    ];

    for (const column of columns) {
      await queryInterface.removeColumn("machine_specs", column);
    }

    await queryInterface.changeColumn("machine_specs", "specName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("machine_specs", "specValue", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
