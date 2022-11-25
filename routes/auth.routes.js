// importing express router
import { Router } from 'express';

// importing controllers
import {
  userSignup,
  userlogin,
  signupVerifyEmail,
} from '../controllers/auth.controllers.js';

// creating router
export const router = Router();

// Auth routes
router.post('/user/login', userlogin);
router.post('/user/signup', userSignup);
router.post('/user/signup/otp', signupVerifyEmail);

// OAuth routes
// router.post("/google");
// router.post("/github");
// router.post("/linkedin");
