// importing express router
import { Router } from 'express';

// importing controllers
import {
  userSignup,
  userlogin,
  signupVerifyEmail,
  signupVerifyEmailOTP,
} from '../controllers/auth.controllers.js';

// importing middlewares
import { checkSignupUser } from '../middlewares/auth/signupUser.js';

// creating router
export const router = Router();

// Auth routes
router.post('/user/login', userlogin);
router.post('/user/signup', checkSignupUser, userSignup);
router.post('/user/signup/otp', signupVerifyEmail);
router.post('/user/signup/verify-otp', checkSignupUser, signupVerifyEmailOTP);

// OAuth routes
// router.post("/google");
// router.post("/github");
// router.post("/linkedin");
