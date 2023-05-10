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
} from '../controllers/user.controllers.js';

// importing middlewares
import { checkUserSession } from '../middlewares/session/sessionUser.js';

// creating router
export const router = Router();

// common routes
router.get('/info', checkUserSession, basicUserDetails);

// github routes
router.get('/github/info', checkUserSession, userGitHubData);
router.get('/github/repos', checkUserSession, getUserGitHubRepos);

// processing routes
router.get('/ranking', checkUserSession, getUserRanking);
router.get('/recommendations', checkUserSession, recommendUsers);

// statements routes
router.get('/statements', checkUserSession, getUserProblemStatements);
