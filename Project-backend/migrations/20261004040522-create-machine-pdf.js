module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("machine_pdfs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      machineId: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "machines",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      filePath: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      fileSize: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable("machine_pdfs");
  },
};
