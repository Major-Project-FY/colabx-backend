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
import { ProblemStatement } from '../models/problemStatements.js';
import { Following } from '../models/following.js';

//importing helper functions
import {
  getfollowersWithBasicInfo,
  getfollowingsWithBasicInfo,
} from '../utils/others/user.utils.js';

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
          `unable to find basic data for user with id ${userID} requested from IP address ${req.ip}`
        );
        res.status(404).json({
          status: 'unsuccessful',
          msg: 'github data for current user does not exist',
        });
      }
    } else {
      warningLog(
        'User',
        `unable to get user ID for authenticated user with IP ${req.ip}`
      );
      const error = new Error(
        `UserID not found for user logged in with ip ${req.ip}`
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
          `unable to find github data for user with id ${userID} requested from IP address ${req.ip}`
        );
        res.status(404).json({
          status: 'unsuccessful',
          msg: 'github data for current user does not exist',
        });
      }
    } else {
      warningLog(
        'User',
        `unable to get user ID for authenticated user with IP ${req.ip}`
      );
      const error = new Error(
        `UserID not found for user logged in with ip ${req.ip}`
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
  try {
    const { userID } = res.locals.user;
    axios({
      method: 'get',
      // maxContentLength: Infinity,
      url: `${config.processingBackendDomain}/processing/rank-user/${userID}`,
    })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    res.status(500).json({ status: 'unsuccessful' });
  }
};

export const recommendUsers = async (req, res, next) => {
  try {
    const { userID } = res.locals.user;
    const randomRows = await User.findAll({
      attributes: [
        ['id', 'userID'],
        ['first_name', 'firstName'],
        ['last_name', 'lastName'],
        ['email', 'userMail'],
      ],
      where: {
        id: {
          [Op.ne]: userID,
        },
      },
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
  } catch (error) {
    res.status(500).json({
      status: 'unsuccessful',
    });
  }
};

export const getUserProblemStatements = async (req, res, next) => {
  try {
    const statements = await ProblemStatement.findAll({
      attributes: [
        ['id', 'postID'],
        ['user_id', 'userID'],
        ['problem_statement_text', 'statementText'],
        ['urls', 'postURLs'],
        ['createdAt', 'postedOn'],
      ],
      where: {
        user_id: { [Op.eq]: res.locals.user.userID },
      },
      order: [['createdAt', 'DESC']],
    });
    if (statements) {
      res.status(200).json(statements);
    } else {
      res.status(404).json({
        status: 'unsuccessful',
        msg: 'statement post not found',
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'unsuccessful', msg: 'server error' });
  }
};

export const followUser = async (req, res, next) => {
  try {
    const { userID } = res.locals.user;
    const followCheckResult = await Following.count({
      where: {
        user_id: { [Op.eq]: userID },
        following_id: { [Op.eq]: req.body.following },
      },
    });
    console.log(followCheckResult);
    if (followCheckResult >= 0) {
      if (followCheckResult > 0) {
        res.status(409).json({
          status: 'unsuccessful',
          msg: 'user is alredy following given user',
        });
      } else {
        const followerCreateResult = await Following.create({
          user_id: userID,
          following_id: req.body.following,
        });
        if (followerCreateResult) {
          res.status(200).json({ status: 'successful' });
        } else {
          res.status(500).json({ status: 'unsuccessful' });
        }
      }
    } else {
      res.status(500).json({ status: 'unsuccessful' });
    }
  } catch (error) {
    res.status(400).json({ status: 'unsuccessful' });
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const followersResult = await getfollowersWithBasicInfo(
      res.locals.user.userID
    );
    if (followersResult) {
      res.status(200).json(followersResult);
    } else {
      res.status(400).json({ status: 'unsuccessful' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'unsuccessful' });
  }
};

export const getFollowings = async (req, res, next) => {
  try {
    const followingsResult = await getfollowingsWithBasicInfo(
      res.locals.user.userID
    );
    if (followingsResult) {
      res.status(200).json(followingsResult);
    } else {
      res.status(400).json({ status: 'unsuccessful' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'unsuccessful' });
  }
};
