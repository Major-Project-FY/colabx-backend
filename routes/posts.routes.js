// importing express router
import { Router } from 'express';

// importing controllers
import {
  postProject,
  getPost,
  getPostsForFeed,
} from '../controllers/posts.controllers.js';

// importing middlewares
import { checkUserSession } from '../middlewares/session/sessionUser.js';

// creating router
export const router = Router();

// common routes
router.get('/post/:postID', checkUserSession, getPost);
router.post('/post', checkUserSession, postProject);

router.get('/', checkUserSession, getPostsForFeed);
