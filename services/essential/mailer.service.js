// module imports
import { createTransport } from 'nodemailer';
import { google } from 'googleapis';

// importing config
import { env } from '../../config/config.js';

// importing helper functions
import { serverExit } from '../logger/logger.js';
import { log } from '../logger/color.logger.js';

// assigning env
let envStore;

if (env == 'development') {
  envStore = (await import('../../config/config.js')).development;
} else if (env == 'production') {
  envStore = (await import('../../config/config.js')).production;
} else if (env == 'test') {
  envStore = (await import('../../config/config.js')).test;
} else {
  // when no env specified server will exit
  serverExit('no specified mailer environment was found');
}

// assigning config
const config = envStore;
envStore = undefined;

const OAuth2Client = new google.auth.OAuth2(
  config.googleOAuthClientID,
  config.googleOAuthClientSecret
);

OAuth2Client.setCredentials({
  refresh_token: config.mailerRefershToken,
});

const accessToken = await OAuth2Client.getAccessToken();

export const sendServiceMail = async (mailerOptions) => {
  return new Promise(function (resolve, reject) {
    try {
      const nodemailerOptions = {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: config.mailerEmailID,
          clientId: config.googleOAuthClientID,
          clientSecret: config.googleOAuthClientSecret,
          refreshToken: config.mailerRefershToken,
          accessToken: accessToken,
        },
      };
      const transporter = createTransport(nodemailerOptions);
      transporter
        .sendMail({ ...mailerOptions })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    } catch (error) {
      console.log(error);
    }
  });
};

// console.log(accessToken);
