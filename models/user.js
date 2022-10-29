import { Sequelize, DataTypes } from "sequelize";
import { mainDB } from "../loaders/baseDB.init.js";

const sequelize = new Sequelize("postgres::memory:");

export const User = mainDB.define(
  "users",
  {
    // Model attributes are defined here
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      primaryKey: true,
    },
    first_name: {
      allowNull: false,
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    email: { allowNull: false, type: DataTypes.STRING, unique: true },
    password: { allowNull: false, type: DataTypes.STRING },
    last_login: { allowNull: false, type: DataTypes.DATE },
    last_ip_address: { type: DataTypes.STRING },
  },
  {
    // Other model options go here
    freezeTableName: true,
  }
);

User.sync({ force: true });

// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true
