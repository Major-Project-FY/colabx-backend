import "dotenv/config";

export const env = process.argv[2];

export const development = {
  backendDomain: process.env.DEV_BACKEND_DOMAIN,
  protocol: process.env.DEV_PROTOCOL_TYPE,
  ensecret: process.env.DEV_ENCRYPTON_SECRET,
  tokenSecret: process.env.DEV_TOKEN_SECRET,
  port: process.env.DEV_BACKEND_PORT,
};

export const test = {
  backendDomain: process.env.TEST_BACKEND_DOMAIN,
  protocol: process.env.TEST_PROTOCOL_TYPE,
  ensecret: process.env.TEST_ENCRYPTON_SECRET,
  tokenSecret: process.env.TEST_TOKEN_SECRET,
  port: process.env.TEST_BACKEND_PORT,
};

export const production = {
  backendDomain: process.env.PROD_BACKEND_DOMAIN,
  protocol: process.env.PROD_PROTOCOL_TYPE,
  ensecret: process.env.PROD_ENCRYPTON_SECRET,
  tokenSecret: process.env.PROD_TOKEN_SECRET,
  port: process.env.PROD_BACKEND_PORT,
};
