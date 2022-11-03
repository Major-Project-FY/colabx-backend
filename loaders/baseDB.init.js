// importing config vars
import { env } from '../config/config.js';
import { log } from '../services/logger/color.logger.js';

// assigning env
let envStore;

if (env == 'development') {
  envStore = (await import('../config/db.config.js')).development;
} else if (env == 'production') {
  envStore = (await import('../config/db.config.js')).production;
} else if (env == 'test') {
  envStore = (await import('../config/db.config.js')).test;
} else {
  log.red('✗ no specified database environment was found');
  console.log('\nserevr will now exit ...\n');
  process.exit(-1);
}

// assigning config
const config = envStore;
envStore = undefined;

// importing modules
import { Sequelize } from 'sequelize';

// export const mainDB = new Sequelize(
//   config.database,
//   config.username,
//   config.password,
//   {
//     host: config.host,
//     dialect: config.dialect,
//     port: Number(config.port),
//     logging: env == "development" ? console.log : false,
//     // logging: console.log,
//   }
// );

export const mainDB = new Sequelize(
  `${config.dialect}://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`,
  {
    dialect: config.dialect,
    port: Number(config.port),
    protocol: config.protocol,
    logging: env == 'development' ? console.log : false,
    dialectOptions:
      config.hostType == 'server' ? { ssl: true, native: true } : {},
  }
);

try {
  await mainDB.authenticate();
} catch (error) {
  log.red('\n✗ unable to establish connection with main database\n');
  console.log(error);
  log.red('\n * terminating serevr *\n');
  process.exit(1);
}
