// importing express router
import { Router } from 'express';

// importing controllers
import { postProblemStatement } from '../controllers/problemStatements.controllers.js';

// importing middlewares
import { checkUserSession } from '../middlewares/session/sessionUser.js';

// creating router
export const router = Router();

// common routes
// router.get('/problem-satement/:postID', checkUserSession, getPost);
router.post('/post', checkUserSession, postProblemStatement);

// router.get('/', checkUserSession, getPostsForFeed);
