// imports
import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';

// const vars
const { tokenSecret } = config;

export const checkSignupUser = (req, res, next) => {
  try {
    // const token = req.cookies.authToken;
    // console.log("cookies", req.cookies)
    const token = req.cookies['verification-access'];
    console.log('token', token);
    if (token) {
      jwt.verify(token, tokenSecret, (err, decodedToken) => {
        if (decodedToken) {
          console.log('token verified', _decodedToken);
          res.locals.user = decodedToken;
          next();
        } else if (err) {
          console.log(err);
          res.locals.user = null;
          console.log('invalid session');
          res.status(403).json({
            success: false,
            err: err.message,
          });
        } else {
          console.log('unexpected error occureed');
          res.status(500).json({
            success: false,
            err: 'unexpected error occured',
          });
        }
      });
    } else {
      console.log('token not found');
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
