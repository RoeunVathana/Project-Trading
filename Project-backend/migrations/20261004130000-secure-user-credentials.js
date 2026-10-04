'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'username', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING(254),
      allowNull: false,
    });
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING(60),
      allowNull: false,
    });
    const indexes = await queryInterface.showIndex('Users');
    if (!indexes.some((index) => index.name === 'users_username_unique')) {
      await queryInterface.addConstraint('Users', {
        fields: ['username'],
        type: 'unique',
        name: 'users_username_unique',
      });
    }
    if (!indexes.some((index) => index.name === 'users_email_unique')) {
      await queryInterface.addConstraint('Users', {
        fields: ['email'],
        type: 'unique',
        name: 'users_email_unique',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Users', 'users_email_unique');
    await queryInterface.removeConstraint('Users', 'users_username_unique');
    await queryInterface.changeColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
