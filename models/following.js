// importing modules
import { Sequelize, DataTypes } from 'sequelize';
import { mainDB } from '../loaders/baseDB.init.js';

// importing dependency module
import { User } from './user.js';
import { followUser } from '../controllers/user.controllers.js';

// defining models
export const Following = mainDB.define(
  'following',
  {
    // Model attributes are defined here
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    following_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
Following.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'fk_following_user_id',
});
Following.belongsTo(User, {
  foreignKey: 'following_id',
  as: 'fk_following_following_id',
});

Following.removeAttribute('id');

// Following.sync({ force: true });
