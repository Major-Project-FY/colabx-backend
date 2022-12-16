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
import { hashPassword } from '../utils/auth/crypto.utils.js';

// importing utils
import { log } from '../services/logger/color.logger.js';
import { successLog, warningLog } from '../services/logger/logger.js';

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
    userIP: req.socket.remoteAddress,
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
          signupUserEmail: req.body.userEmail,
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
  // console.log(res.locals.user);
  const recievedOTP = req.body.userOTP;
  const result = await signupUser.find({
    signupEmail: res.locals.user.signupUserEmail,
  });
  console.log(result[0].userOTP, recievedOTP);
  if (result.length && result[0].userOTP == recievedOTP) {
    console.log('equal');
    res.status(200).json({ status: 'success' });
  } else {
    console.log('not equal');
    res.status(400).json({ status: 'failed' });
  }
  // try {
  // } catch (error) {
  //  warningLog("User Signup", "error while reading otp")
  // }
};

export const userSignup = async (req, res, next) => {
  const hashedPassword = await hashPassword(req.body.userPassword);
  delete req.body.userPassword;
  console.log(hashedPassword);
  console.log('inside user signup');
  console.log('IP:', req.socket.remoteAddress);
  User.create({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.userEmail,
    password: hashedPassword,
    last_login: currentDate(),
    last_ip_address: req.socket.remoteAddress,
  })
    .then((result) => {
      console.log("Jane's auto-generated ID:", result.id);
      res
        .status(200)
        .json({ status: 'success', msg: 'user signup sucessful' })
        .send();
      successLog(
        'User Signup',
        `user ${email} has successfully signed up with IP Address ${req.socket.remoteAddress}`
      );
    })
    .catch((err) => {
      const result = { success: false, err: err.message };
      console.error(err.original);
      if (err.original && err.original.code && err.original.code == '23505') {
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
