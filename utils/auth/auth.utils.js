// module imports
import { Sequelize, Op } from 'sequelize';

// database models import
import { User } from '../../models/user.js';

// importing required helper functions
import { getOTP } from '../basic/basic.utils.js';

// helper funtion for verifying does user exist or not
export const checkUserExistByEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findAndCountAll({
        attributes: [
          ['id', 'userID'],
          ['email', 'userMail'],
        ],
        where: { email: { [Op.eq]: email } },
      });
      if (user.count === 1) {
        console.log(user.rows[0]);
        resolve(user);
      } else if (user.count === 0) {
        resolve(false)
      } 
      else {
        const err = new Error('Ambigous account info recieved');
        err.type = 'AMBACC';
        reject(err);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const sendSignupOTPMail = async (email) => {};
