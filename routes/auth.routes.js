// importing express router
import { Router } from 'express';

// importing controllers
import {
  userSignup,
  userlogin,
  signupVerifyEmail,
  signupVerifyEmailOTP,
} from '../controllers/auth.controllers.js';

import {
  sendGitHubAuthLink,
  authorizeGitHubUser,
  getUserEmailforGithub,
} from '../controllers/integrations.controllers.js';

// importing middlewares
import {
  checkSignupUser,
  checkSignUpGitHubUser,
} from '../middlewares/auth/signupUser.js';

// creating router
export const router = Router();

// Auth routes
router.post('/user/login', userlogin);
router.post('/user/signup', checkSignupUser, userSignup);
router.post('/user/signup/otp', signupVerifyEmail);
router.post('/user/signup/verify-otp', checkSignupUser, signupVerifyEmailOTP);

// opeartion Routes
router.post('/user/send-email');

// OAuth routes
// router.post("/google");

router.get('/github', sendGitHubAuthLink);
router.post('/github/authorize', authorizeGitHubUser);

// router.post("/linkedin");
