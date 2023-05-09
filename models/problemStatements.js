// importing modules
import { Sequelize, DataTypes } from 'sequelize';

// importing database connection
import { mainDB } from '../loaders/baseDB.init.js';

// importing dependency schema
import { User } from './user.js';

export const ProblemStatement = mainDB.define(
  'problem_statements',
  {
    // Model attributes are defined here
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    problem_statement_text: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    urls: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
  },
  {
    // Other model options go here
    freezeTableName: true,
  }
);

ProblemStatement.belongsTo(User, { foreignKey: 'user_id', as: 'users' });

// ProblemStatement.sync({ force: true });
