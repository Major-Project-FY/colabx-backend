// modules import
import axios from 'axios';
import { config } from '../../config/config.js';

const { githubClientID, githubRedirectURL, githubClientSecret } = config;

// helper function that gets github profile info
export const getUserProfileInfo = (code) => {
  return new Promise(function (resolve, reject) {
    const authorizeURI = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubClientSecret}&code=${code}&redirect_uri=${githubRedirectURL}`;
    var authorizeConfig = {
      method: 'get',
      url: authorizeURI,
    };
    axios(authorizeConfig)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
