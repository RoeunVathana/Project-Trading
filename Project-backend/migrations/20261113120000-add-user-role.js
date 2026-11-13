'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const usersDescription = await queryInterface.describeTable('Users');
    if (!usersDescription.role) {
      await queryInterface.addColumn('Users', 'role', {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'staff',
      });
    }
    if (!usersDescription.permissions) {
      await queryInterface.addColumn('Users', 'permissions', {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      });
    }

    const usersTable = queryInterface.quoteTable('Users');
    const roleColumn = queryInterface.quoteIdentifier('role');
    const usernameColumn = queryInterface.quoteIdentifier('username');
    const idColumn = queryInterface.quoteIdentifier('id');

    await queryInterface.sequelize.query(
      `UPDATE ${usersTable} SET ${roleColumn} = 'admin' WHERE LOWER(${usernameColumn}) = 'admin'`,
    );
    const [admins] = await queryInterface.sequelize.query(
      `SELECT ${idColumn} FROM ${usersTable} WHERE ${roleColumn} = 'admin' LIMIT 1`,
    );
    if (!admins.length) {
      await queryInterface.sequelize.query(
        `UPDATE ${usersTable} SET ${roleColumn} = 'admin' WHERE ${idColumn} = (SELECT ${idColumn} FROM ${usersTable} ORDER BY ${idColumn} ASC LIMIT 1)`,
      );
    }
  },

  async down(queryInterface) {
    const usersDescription = await queryInterface.describeTable('Users');
    if (usersDescription.permissions) await queryInterface.removeColumn('Users', 'permissions');
    if (usersDescription.role) await queryInterface.removeColumn('Users', 'role');
  },
};
