'use strict';

const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');

const PASSWORD_SALT_ROUNDS = 12;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(_models) {}

    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: 'users_username_unique',
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        unique: 'users_email_unique',
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      hooks: {
        beforeSave: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, PASSWORD_SALT_ROUNDS);
          }
        },
      },
    },
  );

  return User;
};
