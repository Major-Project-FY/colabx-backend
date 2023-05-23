// importing modules
import { Sequelize, DataTypes } from 'sequelize';
import { mainDB } from '../loaders/baseDB.init.js';

// importing dependency module
import { User } from './user.js';
import { ProblemStatement } from './problemStatements.js';

// defining models
export const StatementCollaborator = mainDB.define(
  'statement_collaborators',
  {
    // Model attributes are defined here
    statement_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    collaborator_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    freezeTableName: true,
    // validate: {
    //   collabValidation() {},
    // },
  }
);

StatementCollaborator.belongsTo(User, {
  foreignKey: 'collaborator_user_id',
  as: 'fk_statement_collaborator_user_id',
});

StatementCollaborator.belongsTo(ProblemStatement, {
  foreignKey: 'statement_id',
  as: 'fk_statement_collaborator_statement_id',
});

StatementCollaborator.removeAttribute('id');

StatementCollaborator.sync({ force: true });
