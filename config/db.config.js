import 'dotenv/config';

export const development = {
  // database vars
  username: process.env.DEV_MAIN_DB_USER,
  password: process.env.DEV_MAIN_DB_PASSWORD,
  database: process.env.DEV_MAIN_DB_NAME,
  host: process.env.DEV_MAIN_DB_HOST,
  port: process.env.DEV_MAIN_DB_PORT,
  dialect: 'postgres',
  protocol: 'postgres',
  hostType: process.env.DEV_HOST_TYPE,
  sslCertificate: process.env.DEV_MAIN_DB_RDS_CERTIFICATE_NAME,

  secondary: {
    uri: process.env.DEV_SECONDARY_DB_URI,
  },
};

export const test = {
  username: 'root',
  password: null,
  database: 'database_test',
  host: '127.0.0.1',
  dialect: 'mysql',
};

export const production = {
  username: 'root',
  password: null,
  database: 'database_production',
  host: '127.0.0.1',
  dialect: 'mysql',
};
