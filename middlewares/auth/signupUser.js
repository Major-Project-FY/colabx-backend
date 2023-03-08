// importing modules
import jwt from 'jsonwebtoken';

// importing configuration
import { config } from '../../config/config.js';

// importing loggers
import { warningLog, errorLog } from '../../services/logger/logger.js';

// const vars
const { tokenSecret } = config;

// this middleware is used to check the authenticity of the
// user which is going through the signup process
export const checkSignupUser = (req, res, next) => {
  try {
    const token = req.cookies['signup verification'];
    if (token) {
      jwt.verify(token, tokenSecret, (err, decodedToken) => {
        if (decodedToken) {
          res.locals.user = decodedToken;
          next();
        } else if (err) {
          console.log(err);
          res.locals.user = null;
          warningLog(
            'User Signup',
            `invalid session or session expired for user with ip address ${req.socket.remoteAddress}`
          );
          res.status(403).json({
            success: false,
            err: err.message,
          });
        } else {
          errorLog(
            'User Signup',
            `error occured while checking token for user with ip address ${req.socket.remoteAddress}`
          );
          res.status(500).json({
            success: false,
            err: 'unexpected error occured',
          });
        }
      });
    } else {
      errorLog(
        'User Signup',
        `token not found for user with ip address ${req.socket.remoteAddress}`
      );
      // console.log('token not found');
      res.status(401).json({
        success: false,
        err: 'invalid session',
      });
    }
  } catch (error) {
    console.log('unable to verify token');
    res.locals.user = null;
    next();
  }
};

export const checkSignUpGitHubUser = (req, res, next) => {
  try {
    const token = req.cookies['s-gh'];
    if (token) {
      jwt.verify(token, tokenSecret, (err, decodedToken) => {
        if (decodedToken) {
          res.locals.user = decodedToken;
          next();
        } else if (err) {
          console.log(err);
          res.locals.user = null;
          warningLog(
            'User Signup',
            `invalid session or session expired for user with ip address ${req.socket.remoteAddress}`
          );
          res.status(403).json({
            success: false,
            err: err.message,
          });
        } else {
          errorLog(
            'User Signup',
            `error occured while checking token for user with ip address ${req.socket.remoteAddress}`
          );
          res.status(500).json({
            success: false,
            err: 'unexpected error occured',
          });
        }
      });
    } else {
      errorLog(
        'User Signup',
        `token not found for user with ip address ${req.socket.remoteAddress}`
      );
      // console.log('token not found');
      res.status(401).json({
        success: false,
        err: 'invalid session',
      });
    }
  } catch (error) {
    console.log('unable to verify token');
    res.locals.user = null;
    next();
  }
};
