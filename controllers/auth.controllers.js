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
import { hashPassword, comparePassword } from '../utils/auth/crypto.utils.js';

// importing utils
import { log } from '../services/logger/color.logger.js';
import { successLog, warningLog } from '../services/logger/logger.js';

///////////////// all initial imports ends here /////////////////

// const vars
const signupCookieMaxAge = 1000 * 60 * 20; // that's 20 mins

// initial signup API for user verification
export const signupVerifyEmail = async (req, res, next) => {
  try {
    // genarating OTP
    const otp = getOTP();

    // creating new signup user
    const user = new signupUser({
      signupEmail: req.body.userEmail,
      userOTP: otp,
      userIP: req.socket.remoteAddress,
      verifiedEmail: false,
    });

    // saving new signup user
    user.save().catch((err) => {
      throw err;
    });

    // creating mail options
    const mailerOptions = new MailerOptions(
      req.body.userEmail,
      `CollabX Signup Verification`,
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
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: 'unsuccessful',
      })
      .send();
  }
};

export const signupVerifyEmailOTP = async (req, res, next) => {
  try {
    const recievedOTP = req.body.userOTP;

    // verifying user exist in OTP database
    const result = await signupUser.find({
      signupEmail: res.locals.user.signupUserEmail,
    });

    // validating the result
    if (result.length == 1 && result[0].userOTP == recievedOTP) {
      console.log('equal');
      const foundUser = result[0];
      foundUser.verifiedEmail = true;
      foundUser
        .save()
        .then(() => {
          res.status(200).json({ status: 'success' });
        })
        .catch((err) => {
          // throw err;
          console.log(err);
          res.status(400).json({ status: 'failed' });
        });
    } else {
      console.log('not equal');
      res.status(400).json({ status: 'failed' });
    }
  } catch (error) {
    warningLog(
      'User Signup',
      `error while reading otp for user with email ${res.locals.user.signupUserEmail}`
    );
    res.status(500).json({
      status: 'unsuccessful',
      msg: 'error occured while processing OTP for current user',
    });
  }
};

// API for user signup
export const userSignup = async (req, res, next) => {
  // upper try catch
  try {
    // verifying user exist in the signup database
    const verifyResult = await signupUser.find({
      signupEmail: res.locals.user.signupUserEmail,
    });

    // validating the results
    if (verifyResult.length == 1 && verifyResult[0].verifiedEmail) {
      const hashedPassword = await hashPassword(req.body.userPassword);
      delete req.body.userPassword;

      // creatig the user
      User.create({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.userEmail,
        password: hashedPassword,
        signed_up_through: 'DEFAULT',
        last_login: currentDate(),
        last_ip_address: req.socket.remoteAddress,
      })
        .then((result) => {
          // updating session cookies
          res.clearCookie('signup verification');

          successLog(
            'User Signup',
            `user with emailID ${req.body.userEmail} added into the database`
          );

          //---> sending signup completion resposne <---//

          res
            .status(200)
            .json({ status: 'success', msg: 'user signup sucessful' });
          // .send();
          successLog(
            'User Signup',
            `user ${req.body.userEmail} has successfully signed up with IP Address ${req.socket.remoteAddress}`
          );
        })
        .catch((err) => {
          // checking type of error

          // console.error(err.original);
          if (
            err.original &&
            err.original.code &&
            err.original.code == '23505'
          ) {
            const error = new Error('same email ID already exists');
            error.code = 'SIGNUP-ALRDYEXIST';
            throw error;
          } else {
            // this error will occur when some error occures during execution
            // of this query

            throw err;
          }

          // sending error response
        });
    } else {
      // this condition will execute when signupuser is not found in database

      const err = new Error('signup user not found in signup user database');
      err.code = 'SIGNUP-USRNOTFOUND';
      throw err;
    }
  } catch (error) {
    // checking, logging and sending response accordingly on type of errors

    // checking for type of errors based on error codes
    if (error.code == 'SIGNUP-USRNOTFOUND') {
      // sending response when signup user doesn't exist in the database

      warningLog(
        'User Signup',
        `user ${res.locals.user.signupUserEmail} not found in signup user database`
      );
      res.status(403).json({ status: 'failed', msg: 'not allowed' });
    } else if (error.code == 'SIGNUP-ALRDYEXIST') {
      // displaying warning and responding when existing user trying to signup

      warningLog(
        'User Signup',
        `user ${res.locals.user.signupUserEmail} with ip ${req.socket.remoteAddress} already exists in database`
      );

      //--> sending response when user with give emailID already exists <--//
      res
        .status(403)
        .json({
          status: 'unsuccessful',
          msg: 'user already exists',
        })
        .send();
    } else {
      // logging and sending response when some undefined execution error
      // occures

      warningLog(
        'User Signup',
        `something went wrong while signing up user ${res.locals.user.signupUserEmail} with ip ${req.socket.remoteAddress}`
      );

      //--> sending response when some undefined error occured <--//
      res.status(500).json({
        status: 'unsuccessful',
        msg: 'something went wrong while signing up the user',
      });
    }
  }
};

// API for user login
export const userlogin = async (req, res, next) => {
  // upper try-catch
  try {
    var toFindUser;

    // inner try catch
    try {
      // findeng user with given credentials
      toFindUser = await User.findAll({
        attributes: [
          ['id', 'userID'],
          ['first_name', 'firstName'],
          ['last_name', 'lastName'],
          ['email', 'userMail'],
          ['password', 'userOriginalPassword'],
        ],
        where: {
          email: { [Op.eq]: req.body.email },
        },
      });
    } catch (error) {
      // throwing sequelize error on execution
      warningLog(
        'User Login',
        `error occured while reading creadintials for client requesting from ip ${req.socket.remoteAddress}`
      );
      throw error;
    }
    // checking when sequelize executed query successfully
    if (toFindUser.length) {
      // when there is some results with given email IDs

      const passwordComparisonResponse = comparePassword(
        req.body.password,
        toFindUser[0].dataValues.userOriginalPassword
      );
      if (passwordComparisonResponse === true) {
        //---> sending response for successful authentication <---//
        res
          .status(200)
          .json({
            status: 'successful',
            msg: 'successfully logged in the user',
          })
          .send();
      } else {
        // when passwords compared are invalid
        throw passwordComparisonResponse;
      }
    } else {
      // when given email ID is not in the databse

      // throwing user not found error
      const err = new Error('User not found');
      err.code = 'LOGIN-USRNOTFOUND';

      throw err;
    }
  } catch (error) {
    // checking for type of error

    if (error.code === 'LOGIN-USRNOTFOUND') {
      // sending response for user not found

      log.red(`\n! ${error.message}\n`);
      res.status(404).json({
        status: 'unsuccessful',
        msg: 'User does not exists',
      });
    } else if (error.code === 'LOGIN-INCRCTUSRCRED') {
      console.log('inside incorrect user cred try catch');
      warningLog(
        'User Login',
        `Login credentials didn't matched for client requesting from ${req.socket.remoteAddress}`
      );
      log.red(`\n! ${error.message}\n`);
      res.status(403).json({
        status: 'unsuccessful',
        msg: 'Invalid credentials recieved',
      });
    } else {
      // sending response for server issue

      log.red(`\n! ${error.message}\n`);
      console.log(error);
      res.status(503).json({
        status: 'server issue',
        msg: 'Unable to process this request at the moment',
      });
    }
  }
};
