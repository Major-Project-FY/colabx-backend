// "use strict";
// import { Model } from "sequelize";

// export default (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   User.init(
//     {
//       first_name: DataTypes.STRING,
//       lastname: DataTypes.STRING,
//       email: DataTypes.STRING,
//       password: DataTypes.STRING,
//       user_id: DataTypes.UUID,
//       last_login: DataTypes.DATE,
//       last_ip_address: DataTypes.STRING,
//     },
//     {
//       sequelize,
//       modelName: "User",
//     }
//   );
//   return User;
// };

import { Sequelize, DataTypes } from "sequelize";
import { mainDB } from "../loaders/baseDB.init.js";

const sequelize = new Sequelize("postgres::memory:");

export const User = mainDB.define(
  "user_accounts",
  {
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    // email: { type: DataTypes.STRING },
    // password: { type: DataTypes.STRING },
    // user_id: { type: DataTypes.UUID },
    // last_login: { type: DataTypes.DATE },
    // last_ip_address: { type: DataTypes.STRING },
  },
  {
    // Other model options go here
    freezeTableName: true,
  }
);

// User.sync({ force: true });

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
