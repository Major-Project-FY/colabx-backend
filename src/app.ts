import express from "express";
// import "dotenv";

import userRouter from "./routes/user.routes"

const port: number = 5000;

const app = express();

app.get("/app", (req: any) => {
  req.name = "hello";
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
