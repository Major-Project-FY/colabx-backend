// importing express router
import { Router } from "express";

// importing controllers
import { userSignup } from "../controllers/auth.controllers.js";

// creating router
export const router = Router();

// Auth routes
// router.post("/user/login");
router.post("/user/signup", userSignup);

// OAuth routes
// router.post("/google");
// router.post("/github");
// router.post("/linkedin");
