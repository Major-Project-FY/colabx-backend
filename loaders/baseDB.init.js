// importing config vars
import { env } from "../config/config.js";
import { log } from "../services/logger/color.logger.js";

// assigning env
let envStore;

if (env == "development") {
  envStore = (await import("../config/db.config.js")).development;
} else if (env == "production") {
  envStore = (await import("../config/db.config.js")).production;
} else if (env == "test") {
  envStore = (await import("../config/db.config.js")).test;
} else {
  log.red("✗ no specified database environment was found");
  console.log("\nserevr will now exit ...\n");
  process.exit(-1);
}

// assigning config
const config = envStore;
envStore = undefined;

// importing modules
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: Number(config.port),
    // logging: env == "production" ? false: console.log,
    logging: false,
  }
);

// sequelize
//   .authenticate()
//   .then((connection) => {
//     console.log("connection", connection);
//     if (connection) {
//       console.log("Connection has been established successfully.");
//     } else {
//       console.error("Unable to connect to the database:");
//     }
//   })
//   .catch((err) => {
//     console.log(err);
//   });

try {
  await sequelize.authenticate();
  // "hello".bye = 1000;
  // console.log("connected to database successfully");
} catch (error) {
  log.red("\n✗ unable to establish connection with main database\n");
  console.log(error);
  log.red("\n * terminating serevr *\n");
  process.exit(1);
}

// console.log( await connection);

// export default connection;
