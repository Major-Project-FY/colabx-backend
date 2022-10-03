// imports
import express from "express";
import "dotenv/config";

// required imports
import { env } from "./config/config.js";
import { log } from "./services/logger/color.logger.js";

// initialization checks
console.log()

// initiating serevr
console.log("\n****** Starting ColabX Backend ******\n");

let envStore;

if (env == "development") {
  envStore = (await import("./config/config.js")).development;
} else if (env == "production") {
  envStore = (await import("./config/config.js")).production;
} else if (env == "test") {
  envStore = (await import("./config/config.js")).test;
} else {
  log.red("✗ no env argument provided");
  console.log("\nserevr will now exit ...\n");
  process.exit(-1);
}

// assigning config
const config = envStore;
envStore = undefined;

// DB imports
import "./loaders/baseDB.init.js";
log.green("✓ established connection with main DB")

// server vars
const port = config.port;
const protocolType = config.protocol;
const servingDomain = "127.0.0.1";

// app vars
const app = express();

// serving app
app.listen(port, (error) => {
  if (error) {
    log.red(`* unable to start serevr at port ${port} *`);
  } else {
    log.green(`✓ Server started at port ${port}`);
    console.log(
      `\nYou can access apis at ${protocolType}://${servingDomain}:${port}/`,
      "\nReady to listen for APIs \n"
    );
  }
});
