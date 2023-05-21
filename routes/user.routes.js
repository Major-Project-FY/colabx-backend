// importing express router
import { Router } from 'express';

// importing controllers
import {
  basicUserDetails,
  userGitHubData,
  getUserGitHubRepos,
  getUserRanking,
  recommendUsers,
  getUserProblemStatements,
  followUser,
  getFollowers,
  getFollowings,
} from '../controllers/user.controllers.js';

import { addSkill, querySkills } from '../controllers/skills.controllers.js';

// importing middlewares
import { checkUserSession } from '../middlewares/session/sessionUser.js';

// creating router
export const router = Router();

// common routes
router.get('/info', checkUserSession, basicUserDetails);
router.post('/follow', checkUserSession, followUser);
router.get('/followers', checkUserSession, getFollowers);
router.get('/followings', checkUserSession, getFollowings);

// github routes
router.get('/github/info', checkUserSession, userGitHubData);
router.get('/github/repos', checkUserSession, getUserGitHubRepos);

// processing routes
router.get('/ranking', checkUserSession, getUserRanking);
router.get('/recommendations', checkUserSession, recommendUsers);

// problem statements routes
router.get('/statements', checkUserSession, getUserProblemStatements);

// skills routes
router.post('/add/skill', checkUserSession, addSkill);
router.get('/skills/query', checkUserSession, querySkills);
