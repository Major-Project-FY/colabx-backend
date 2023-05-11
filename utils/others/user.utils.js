// modules import
import { Op } from 'sequelize';

// models import
import { User } from '../../models/user.js';
import { Following } from '../../models/following.js';

// function to get basic user info of followers
export const getUserBasicInfo = async (userID) => {
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
  return toFindUser;
};

// function to get all following's userIDs
export const getAllFollowings = (userID) => {
  return new Promise(async (resolve, reject) => {
    const followersResult = await Following.findAll({
      attributes: [['following_id', 'followingUserID']],
      where: { user_id: userID },
      raw: true,
    });
    if (followersResult) {
      for (let i in followersResult) {
        followersResult[i] = followersResult[i].followingUserID;
      }
      resolve(followersResult);
    }
  });
};

// function to sync followings userIDs with basic info
export const getfollowingsWithBasicInfo = (userIDs) => {
  return new Promise(async (resolve, reject) => {
    const allFollowersID = await getAllFollowings(userIDs);
    const result = [];
    const promises = allFollowersID.map(async (user) => {
      result.push(await getUserBasicInfo(user));
    });
    await Promise.all(promises);
    resolve(result);
  });
};

// funtion to get all follower's userID
export const getAllFollowers = (userID) => {
  return new Promise(async (resolve, reject) => {
    const followersResult = await Following.findAll({
      attributes: [['user_id', 'followingUserID']],
      where: { following_id: userID },
      raw: true,
    });
    if (followersResult) {
      for (let i in followersResult) {
        followersResult[i] = followersResult[i].followingUserID;
      }
      resolve(followersResult);
    }
  });
};

// function to sync followers userIDs with basic info
export const getfollowersWithBasicInfo = (userIDs) => {
  return new Promise(async (resolve, reject) => {
    const allFollowingsID = await getAllFollowers(userIDs);
    const result = [];
    const promises = allFollowingsID.map(async (user) => {
      result.push(await getUserBasicInfo(user));
    });
    await Promise.all(promises);
    resolve(result);
  });
};
