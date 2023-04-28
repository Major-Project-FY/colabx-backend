import { Sequelize, DataTypes } from 'sequelize';
import { mainDB } from '../loaders/baseDB.init.js';

// importing dependency models
import { User } from './user.js';

// const sequelize = new Sequelize('postgres::memory:');

export const Post = mainDB.define(
  'posts',
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
      type: Sequelize.UUID,
    },
    post_title: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    project_urls: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      // allowNull defaults to true
    },
    post_description: {
      //   allowNull: false,
      type: DataTypes.TEXT,
      //   unique: true,
    },
    media_urls: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
    freezeTableName: true,
    // validate: {
    //   userValidation() {
    //     const values = ['DEFAULT', 'GITHUB', 'LINKEDIN', 'GOOGLE'];
    //     if (values.includes(this.signed_up_through)) {
    //       if (this.signed_up_through === 'DEFAULT' && !this.password) {
    //         throw new Error('Please only insert proper values');
    //       }
    //     } else {
    //       throw new Error('Please only insert proper values');
    //     }
    //   },
    // },
  }
);

Post.belongsTo(User, { foreignKey: 'user_id', as: 'users' });

// Post.sync({ force: true });

// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true
