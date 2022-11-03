// module imports
// import {} from 'nodemailer';
import { google } from 'googleapis';

const OAuth2Client = new google.auth.OAuth2(
  // CLIENTID,
  // CLIENT_SECRET
  '378924397939-cvrvgfo2vvm17s1mgbchb20ak4fa195d.apps.googleusercontent.com',
  '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'
);

OAuth2Client.setCredentials({
  //   refresh_token: REFRESH_TOKEN,
  refresh_token:
    '1//04Z44E1GBzpLqCgYIARAAGAQSNwF-L9IrdZneVQrgxAl_GddmDscLxzFDVau5aU5d-l-B0BKFnNcUUHrYGi7K9YVdUJSpzm5bra0',
});

const accessToken = await OAuth2Client.getAccessToken();

// console.log(accessToken);
