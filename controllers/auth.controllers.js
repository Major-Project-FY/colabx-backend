// importing models
import { User } from '../models/user.js';

// module imports
import { Op } from 'sequelize';

// importing other schemas
import { signupUser } from '../models/other/signupUser.schema.js';

// importing helper functions
import { currentDate, getOTP } from '../utils/basic/basic.utils.js';
import { sendServiceMail } from '../services/essential/mailer.service.js';
import { checkUserExistByEmail } from '../utils/auth/auth.utils.js';
import { MailerOptions } from '../utils/basic/mail.utils.js';
import { createToken } from '../utils/auth/token.utils.js';

// importing utils
import { log } from '../services/logger/color.logger.js';
import { successLog } from '../services/logger/logger.js';

///////////////// all initial imports ends here /////////////////

// const vars
const signupCookieMaxAge = 1000 * 60 * 20; // that's 20 mins

// initial signup API for user verification
export const signupVerifyEmail = async (req, res, next) => {
  // genarating OTP
  const otp = getOTP();

  // creating new signup user
  const user = new signupUser({
    signupEmail: req.body.userEmail,
    userOTP: otp,
  });

  // saving new signup user
  user.save().catch((err) => {
    throw err;
  });

  // creating mail options
  const mailerOptions = new MailerOptions(
    req.body.userEmail,
    `CollabX signup verification`,
    `
        <h1>${otp}</h1>
      `
  );

  // sending service mail
  sendServiceMail(mailerOptions)
    .then((result) => {
      // creating cookie after sending mail
      res.cookie(
        'signup verification',
        createToken({
          signupUserEmail: res.cookie.userEmail,
        }),
        {
          httpOnly: true,
          maxAge: signupCookieMaxAge,
        }
      );

      // sending response to client
      res.status(200).json({ status: true, msg: 'mail sent to user' }).send();

      // logging result
      successLog(
        'User Signup',
        `otp email has successfully sent to user with IP Address ${req.socket.remoteAddress}`
      );
    })
    .catch((error) => {
      // throwing error when occured
      throw error;
    });
  // try {
  // } catch (error) {
  //   console.log(error);
  // }
};

export const signupVerifyEmailOTP = async (req, res, next) => {
  
};

export const userSignup = async (req, res, next) => {
  console.log('inside user signup');
  console.log('IP:', req.socket.remoteAddress);
  User.create({
    first_name: 'Mayuresh',
    last_name: 'Shinde',
    email: 'mvshinde640@gmail.com',
    password: 'password',
    last_login: currentDate(),
    last_ip_address: req.socket.remoteAddress,
  })
    .then((result) => {
      console.log("Jane's auto-generated ID:", result.id);
      res.status(200).json(jane).send();
      successLog(
        'User Signup',
        `user ${email} has successfully signed up with IP Address ${req.socket.remoteAddress}`
      );
    })
    .catch((err) => {
      const result = { success: false, err: err.message };
      console.error(err.original);
      if (err.original.code && err.original.code == '23505') {
        result.msg = 'same email ID already exists';
      } else {
        result.msg = 'something went wrong';
      }
      res.status(500).json(result);
    });
};

export const userlogin = async (req, res, next) => {
  const toFindUser = await User.findAll({
    attributes: [
      ['id', 'userID'],
      ['first_name', 'firstName'],
      ['last_name', 'lastName'],
      ['email', 'userMail'],
    ],
    where: {
      email: { [Op.eq]: req.body.email },
    },
  });
  console.log(toFindUser);
  res.status(200).json(toFindUser).send();
  // try {
  // } catch (error) {
  //   log.red(`\n! ${error.message}\n`);
  //   console.log(error);
  //   res.status(503).json({
  //     success: false,
  //     msg: "Unable to process this request at the moment",
  //   });
  // }
};
