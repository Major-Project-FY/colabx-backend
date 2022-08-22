import express, { Application, Request, Response } from "express";
import "dotenv/config";

import userRouter from "./routes/user.routes.js";

const port: any = process.env.PORT || 5000;

const app: Application = express();

app.get("/", (req: any, res: Response) => {
  res.send("hello!");
});

app.use("/route", userRouter);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
