import 'dotenv/config';

export const env = process.argv[2];

export const development = {
  // server vars
  backendDomain: process.env.DEV_BACKEND_DOMAIN,
  protocol: process.env.DEV_PROTOCOL_TYPE,
  ensecret: process.env.DEV_ENCRYPTON_SECRET,
  tokenSecret: process.env.DEV_TOKEN_SECRET,
  port: process.env.DEV_BACKEND_PORT,

  // OAuth vars
  googleOAuthClientID: process.env.DEV_GOOGLE_OAUTH_CLIENT_ID,
  googleOAuthClientSecret: process.env.DEV_GOOGLE_OAUTH_CLIENT_SECRET,

  // mailer token
  mailerAuthCode: process.env.DEV_MAILER_OAUTH_AUTHORIZATION_CODE,
  mailerRefershToken: process.env.DEV_MAILER_OAUTH_REFRESH_TOKEN,

  // mailer options vars
  mailerEmailID: process.env.DEV_MAILER_EMAIL_ID,
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

let envStore;

if (env == 'development') {
  envStore = development;
} else if (env == 'production') {
  envStore = production;
} else if (env == 'test') {
  envStore = test;
} else {
  serverExit('no env argument provided');
}

// assigning config
export const config = envStore;
envStore = undefined;
