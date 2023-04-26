// module imports
import { Op, Sequelize } from 'sequelize';
import axios from 'axios';

// importing config
import { config } from '../config/config.js';

// imporing utils
import {
  getUserAllRepos,
  processAndSyncRepoInfo,
} from '../utils/auth/integration.utils.js';

// importing database models
import { User } from '../models/user.js';
import { gitHubUserInfo } from '../models/other/userGitHubInfo.schema.js';

// importing loggers
import { warningLog } from '../services/logger/logger.js';

// User APIs

// API to get basic user details of authenticated user
export const basicUserDetails = async (req, res, next) => {
  try {
    const { userID } = res.locals.user;
    if (userID) {
      const toFindUser = await User.findOne({
        attributes: [
          ['id', 'userID'],
          ['first_name', 'firstName'],
          ['last_name', 'lastName'],
          ['email', 'userMail'],
        ],
        where: {
          id: {
            [Op.eq]: userID,
          },
        },
      });
      if (toFindUser) {
        res.status(200).json(toFindUser);
      } else {
        warningLog(
          'User',
          `unable to find basic data for user with id ${userID} requested from IP address ${req.socket.remoteAddress}`
        );
        res.status(404).json({
          status: 'unsuccessful',
          msg: 'github data for current user does not exist',
        });
      }
    } else {
      warningLog(
        'User',
        `unable to get user ID for authenticated user with IP ${req.socket.remoteAddress}`
      );
      const error = new Error(
        `UserID not found for user logged in with ip ${req.socket.remoteAddress}`
      );
      error.code = 'USRIDNOTFOUND';
      throw error;
    }
  } catch (error) {
    if (error.code == 'USRIDNOTFOUND') {
      console.log(error);
      res.status(400).json({
        status: 'unsuccessful',
        msg: 'user not authenticated',
      });
    } else {
      console.log(error);
      res.status(500).json({
        status: 'unsuccessful',
        msg: 'serevr error',
      });
    }
  }
};

// API to get GitHub data of authenticated user
export const userGitHubData = async (req, res, next) => {
  try {
    const { userID } = res.locals.user;
    if (userID) {
      const result = await gitHubUserInfo.findOne({ userID: userID });
      if (result) {
        res.status(200).json(result);
      } else {
        warningLog(
          'User',
          `unable to find github data for user with id ${userID} requested from IP address ${req.socket.remoteAddress}`
        );
        res.status(404).json({
          status: 'unsuccessful',
          msg: 'github data for current user does not exist',
        });
      }
    } else {
      warningLog(
        'User',
        `unable to get user ID for authenticated user with IP ${req.socket.remoteAddress}`
      );
      const error = new Error(
        `UserID not found for user logged in with ip ${req.socket.remoteAddress}`
      );
      error.code = 'USRIDNOTFOUND';
      throw error;
    }
  } catch (error) {
    if (error.code == 'USRIDNOTFOUND') {
      console.log(error);
      res.status(400).json({
        status: 'unsuccessful',
        msg: 'user not authenticated',
      });
    } else {
      console.log(error);
      res.status(500).json({
        status: 'unsuccessful',
        msg: 'serevr error',
      });
    }
  }
};

//APIs get user's github repositories info
export const getUserGitHubRepos = async (req, res, next) => {
  try {
    const { userID, access_token } = res.locals.user;

    const user = await gitHubUserInfo.findOne({ userID: userID }, [
      'gitHubUsername',
    ]);

    const result = await getUserAllRepos(user.gitHubUsername, access_token);

    const finalResult = await processAndSyncRepoInfo(
      result,
      userID,
      user.gitHubUsername,
      access_token
    );
    if (finalResult) {
      res.status(200).json(finalResult);
    } else {
      res.status(400).json({
        status: 'unsuccessful',
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'unsuccessful' });
  }
};

export const getUserRanking = async (req, res, next) => {
  const { userID } = res.locals.user;
  axios({
    method: 'get',
    // maxContentLength: Infinity,
    url: `${config.processingBackendDomain}/processing/rank-user/${userID}`,
  })
    .then((response) => {
      res.status(200).json({ userLevel: response.data['user_level'] });
    })
    .catch((err) => {
      throw err;
    });
  try {
  } catch (error) {}
};

export const recommendUsers = async (req, res, next) => {
  const randomRows = await User.findAll({
    attributes: [
      ['id', 'userID'],
      ['first_name', 'firstName'],
      ['last_name', 'lastName'],
      ['email', 'userMail'],
    ],
    order: Sequelize.literal('random()'),
    limit: 20,
  });
  if (randomRows) {
    res.status(200).json(randomRows);
  } else {
    res.status(400).json({
      status: 'unsuccessful',
    });
  }
  // try {

  // } catch (error) {
  //   res.status(500).json({
  //     status: 'unsuccessful',
  //   });
  // }
};
