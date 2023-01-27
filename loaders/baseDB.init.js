// importing config vars
import { env } from '../config/config.js';

// importing helper functions
import { serverExit } from '../services/logger/logger.js';

// assigning env
let envStore;

if (env == 'development') {
  envStore = (await import('../config/db.config.js')).development;
} else if (env == 'production') {
  envStore = (await import('../config/db.config.js')).production;
} else if (env == 'test') {
  envStore = (await import('../config/db.config.js')).test;
} else {
  serverExit('no specified database environment was found');
}

// assigning config
const config = envStore;
envStore = undefined;

// importing modules
import { Sequelize } from 'sequelize';

const connectionString = `${config.dialect}://${config.username}:${config.password}@${config.host}/${config.database}`;
// config.hostType == 'render'
//   ? `${config.dialect}://${config.username}:${config.password}@${config.host}/${config.database}`
//   : `${config.dialect}://${config.username}:${config.password}@${config.host}/${config.database}`;

// let dialectOptions;
// if (config.hostType == 'render') {
//   dialectOptions = {}
// } else if (config.hostType) {
// }

// creating main DB connection config
export const mainDB = new Sequelize(connectionString, {
  dialect: config.dialect,
  port: Number(config.port),
  protocol: config.protocol,
  logging: env == 'development' ? console.log : false,
  dialectOptions: {
    ssl: true,
    native: true,
    rejectUnauthorized: false,
  },
  // dialectOptions: config.hostType == 'render'
  //   ? { ssl: true, native: true, rejectUnauthorized: false }
  //   : {},
});

// connecting to main DB
try {
  await mainDB.authenticate();
} catch (error) {
  console.log(error);
  serverExit('unable to establish connection with main database');
}
