// imports
import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';

// const vars
const { tokenSecret } = config;

// this function creates and exports jwt token
export const createToken = (content) => {
  const token = jwt.sign(content, tokenSecret, {
    expiresIn: 1200, // that's 20 mins
  });
  return token;
};

export const createTokenWithExpiresIn = (content, expiresIn) => {
  const token = jwt.sign(content, tokenSecret, {
    expiresIn: expiresIn,
  });
  return token;
};

// this function revokes a token
export const revokeToken = () => {};
