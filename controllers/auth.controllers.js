// importing models
import { User } from '../models/user.js';

// module imports
import { Op } from 'sequelize';

// importing helper functions
import { currentDate } from '../utils/basic.utils.js';
import '../services/essential/mailer.service.js';

// importing utils
import { log } from '../services/logger/color.logger.js';
import { successLog } from '../services/logger/logger.js';

// console.log("user", User);

export const signupVerifyEmail = async (req, res, next) => {};

export const userSignup = async (req, res, next) => {
  console.log('inside user signup');
  console.log('IP:', req.socket.remoteAddress);
  User.create({
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'janedoe@gmail.com',
    password: 'password',
    last_login: currentDate(),
    last_ip_address: req.socket.remoteAddress,
  })
    .then((result) => {
      console.log("Jane's auto-generated ID:", result.id);
      res.status(200).json(jane).send();
      successLog(
        'User Signup',
        `user ${email} has successfully logged in with IP Address ${req.socket.remoteAddress}`
      );
    })
    .catch((err) => {
      const result = { success: false, err: err.message };
      console.error(err.original);
      if (err.original.code && err.original.code == '23505') {
        result.msg = 'same email ID already exists';
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
