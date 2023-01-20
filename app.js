// module imports
import express from 'express';
import cookieParser from 'cookie-parser';

// importing config
import { config } from './config/config.js';

// importing logger
import { log } from './services/logger/color.logger.js';

// initiating serevr
console.log('\n****** Starting ColabX Backend ******\n');

// server vars
const port = config.port;
const protocolType = config.protocol;
const servingDomain = '127.0.0.1';

// DB imports
import { mainDB } from './loaders/baseDB.init.js';
log.green('✓ Established connection with main DB');
import './loaders/secondaryDB.init.js';
log.green('✓ Established connection with secondary DB');

// app vars
const app = express();

// importing routers
import { router as authRouter } from './routes/auth.routes.js';

// using middlewares
import cors from 'cors';
import morgan from 'morgan';
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(morgan('combined'));

// using routers
app.use('/auth', authRouter);

// default route
app.use('/', (req, res) => {
  // redirecting default backend route to frontend homepage
  res.redirect(`https://${config.frontendDomain}`);
});

// serving app
app.listen(port, (error) => {
  if (error) {
    log.red(`* unable to start serevr at port ${port} *`);
  } else {
    log.green(`✓ Started server at port ${port}`);
    console.log(
      `\nYou can access apis at ${protocolType}://${servingDomain}:${port}/`,
      '\nReady to listen for APIs \n'
    );
  }
});
