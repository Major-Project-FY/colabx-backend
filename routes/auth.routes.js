// importing express router
import { Router } from "express";

// creating router
const router = Router();

// Auth routes
router.post("/user/login");
router.post("/user/signup");

// OAuth routes
router.post("/google");
router.post("/github");
router.post("/linkedin");
