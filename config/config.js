'use strict';

import 'dotenv/config';

export const env = process.argv[2];

export const development = {
  // server vars
  backendDomain: process.env.DEV_BACKEND_DOMAIN,
  processingBackendDomain: process.env.DEV_PROCESSING_BACKEND_DOMAIN,
  protocol: process.env.DEV_PROTOCOL_TYPE,
  ensecret: process.env.DEV_ENCRYPTON_SECRET,
  tokenSecret: process.env.DEV_TOKEN_SECRET,
  port: process.env.DEV_BACKEND_PORT,
  // port: process.env.PORT,

  // other config vars
  frontendDomain: process.env.DEV_FRONTEND_DOMAIN || 'localhost:3000',

  // OAuth vars
  googleOAuthClientID: process.env.DEV_GOOGLE_OAUTH_CLIENT_ID,
  googleOAuthClientSecret: process.env.DEV_GOOGLE_OAUTH_CLIENT_SECRET,

  // mailer token
  mailerAuthCode: process.env.DEV_MAILER_OAUTH_AUTHORIZATION_CODE,
  mailerRefershToken: process.env.DEV_MAILER_OAUTH_REFRESH_TOKEN,

  // mgithubRedirectURLailer options vars
  mailerEmailID: process.env.DEV_MAILER_EMAIL_ID,

  // github OAuth vars
  githubClientID: process.env.DEV_GITHUB_CLIENT_ID,
  githubClientSecret: process.env.DEV_GITHUB_CLIENT_SECRET,
  githubRedirectURL: process.env.DEV_GITHUB_REDIRECT_URL,
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
