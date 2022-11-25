// module imports
import { Sequelize, Op } from 'sequelize';

// database models import
import { User } from '../../models/user.js';

// importing required helper functions
import { getOTP } from '../basic/basic.utils.js';

// helper funtion for verifying does user exist or not
export const checkUserExistByEmail = async (email) => {
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
      return true;
    } else {
      const err = new Error('Ambigous account info recieved');
      err.type = 'AMBACC';
      throw err;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

const sendSignupOTPMail = async (email) => {};
