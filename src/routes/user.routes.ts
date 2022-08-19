import { Router } from "express";

const router = Router();
// test routes
router.get("/app", (req, res) => {
  res.send("hello");
});

export default router;
