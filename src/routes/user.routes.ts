import { Router } from "express";

const router = Router();
// test routes
router.get("/app", (req, res) => {
  res.send("hello from app");
});

export default router;
