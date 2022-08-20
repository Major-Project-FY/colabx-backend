import express, { Application, Request, Response } from "express";
// import "dotenv";

import userRouter from "./routes/user.routes";

const port: number = 5000;

const app: Application = express();

app.get("/", (req: any, res: Response) => {
  res.send("hello!");
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
