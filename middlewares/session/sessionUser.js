// importing modules
import jwt from 'jsonwebtoken';

// importing configuration
import { config } from '../../config/config.js';

// importing loggers
import { warningLog, errorLog } from '../../services/logger/logger.js';

// const vars
const { tokenSecret } = config;

// github session middleware
export const checkUserSession = (req, res, next) => {
  try {
    const token = req.cookies['st'];
    if (token) {
      jwt.verify(token, tokenSecret, (err, decodedToken) => {
        if (decodedToken) {
          res.locals.user = decodedToken;
          console.log('ip', req.ip);
          console.log(req.headers);
          const clientIP =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          const ipv4 = clientIP.includes(':')
            ? clientIP.split(':').slice(-1)[0]
            : clientIP;
          console.log('IPv4', ipv4);
          next();
        } else if (err) {
          console.log(err);
          res.locals.user = null;
          warningLog(
            'User Signup',
            `invalid session or session expired for user with ip address ${req.socket.remoteAddress}`
          );
          res.status(403).json({
            status: 'unsuccessful',
            err: err.message,
          });
        } else {
          errorLog(
            'User Signup',
            'error occured while checking token for user with ip address ${req.socket.remoteAddress}'
          );
          res.status(500).json({
            status: 'unsuccessful',
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
        status: 'unsuccessful',
        err: 'user not logged in',
      });
    }
  } catch (error) {
    errorLog(
      'User Signup',
      `unable to verify token for user with ip address ${req.socket.remoteAddress}`
    );
    console.log(error);
    res.status(500).json({
      success: false,
      msg: 'server error',
    });
    // res.locals.user = null;
    // next();
  }
};
