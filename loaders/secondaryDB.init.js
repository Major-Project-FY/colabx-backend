import mongoose from 'mongoose';
import { serverExit } from '../services/logger/logger.js';
import { env } from '../config/config.js';

let envStore;

if (env == 'development') {
  envStore = (await import('../config/db.config.js')).development.secondary;
} else if (env == 'production') {
  envStore = (await import('../config/db.config.js')).production;
} else if (env == 'test') {
  envStore = (await import('../config/db.config.js')).test;
} else {
  serverExit('no specified database environment was found');
}

// assigning config
const config = envStore;
envStore = undefined;

mongoose
  .connect(config.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log('connected to mongodb');
  })
  .catch();

mongoose.connection.on('connection', () => {
  console.log('database connected');
});
