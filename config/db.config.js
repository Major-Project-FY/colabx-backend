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

  // OAuth vars
  googleOAuthClientID: process.env.DEV_GOOGLE_OAUTH_CLIENT_ID,
  googleOAuthClientSecret: process.env.DEV_GOOGLE_OAUTH_CLIENT_SECRET,

  // configuration vars
  hostType: process.env.DEV_SERVER_TYPE,
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
