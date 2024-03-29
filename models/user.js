import { Sequelize, DataTypes } from 'sequelize';
import { mainDB } from '../loaders/baseDB.init.js';

// const sequelize = new Sequelize('postgres::memory:');

export const User = mainDB.define(
  'users',
  {
    // Model attributes are defined here
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
    },
    first_name: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    last_name: {
      type: DataTypes.TEXT,
      // allowNull defaults to true
    },
    email: { allowNull: false, type: DataTypes.STRING, unique: true },
    password: { allowNull: true, type: DataTypes.STRING },
    signed_up_through: { allowNull: false, type: DataTypes.STRING },
    last_login: { allowNull: false, type: DataTypes.DATE },
    last_ip_address: { type: DataTypes.STRING },
  },
  {
    // Other model options go here
    freezeTableName: true,
    validate: {
      userValidation() {
        const values = ['DEFAULT', 'GITHUB', 'LINKEDIN', 'GOOGLE'];
        if (values.includes(this.signed_up_through)) {
          if (this.signed_up_through === 'DEFAULT' && !this.password) {
            throw new Error('Please only insert proper values');
          }
        } else {
          throw new Error('Please only insert proper values');
        }
      },
    },
  }
);

// User.sync({ force: true });

// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true
