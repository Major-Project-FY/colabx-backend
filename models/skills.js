// importing modules
import { Sequelize, DataTypes } from 'sequelize';
import { mainDB } from '../loaders/baseDB.init.js';

// defining models
export const Skill = mainDB.define(
  'skills',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    skill: {
      type: DataTypes.TEXT,
      unique: true,
    },
  },
  {
    // Other model options go here
    freezeTableName: true,
    // validate: {
    //   skillValidation() {
    //   },
    // },
  }
);

// Skill.sync({ force: true });
