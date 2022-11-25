import { env } from '../../config/config.js';

const {
  mailerEmailID,
  googleOAuthClientID,
  googleOAuthClientSecret,
  mailerRefershToken,
} = (await import('../../config/config.js'))[env];

// console.log('mail utils', {
//   mailerEmailID,
//   googleOAuthClientID,
//   googleOAuthClientSecret,
//   mailerRefershToken,
// });

export class MailerOptions {
  constructor(to, subject, html) {
    this.from = mailerEmailID;
    this.to = to;
    this.subject = subject;
    this.html = html;
  }
}

// export const nodemailerOptions = {
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: mailerEmailID,
//     clientId: googleOAuthClientID,
//     clientSecret: googleOAuthClientSecret,
//     refreshToken: mailerRefershToken,
//     // accessToken: accessToken,
//   },
// };
