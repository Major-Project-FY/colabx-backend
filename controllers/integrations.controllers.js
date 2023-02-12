// imports
import axios from 'axios';
import { config } from '../config/config.js';
import { createTokenWithExpiresIn } from '../utils/auth/token.utils.js';
import { warningLog } from '../services/logger/logger.js';

// const vars
const gitHubCookieMaxAge = 1000 * 60 * (60 * 2); // that's 2 hrs
const { githubClientID, githubRedirectURL, githubClientSecret } = config;

// required functions

// this function process information coming from github authorize API
function processGitHubAuthResponse(responseString) {
  try {
    let result = {};
    if (responseString) {
      let keyPairs = responseString.split('&');
      // console.log(keyPairs);
      for (const i of keyPairs) {
        // console.log(i);
        let split = i.split('=');
        result[`${split[0]}`] = split[1];
      }
      result.scope = result.scope.split('%2C');
      // console.log(result);
      return result;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

// APIs
export const sendGitHubAuthLink = async (req, res, next) => {
  try {
    const redirectURI = `https://github.com/login/oauth/authorize?scope=repo,user,project&client_id=${githubClientID}&redirect_uri=${githubRedirectURL}`;
    res.status(200).json({ url: redirectURI });
  } catch (error) {
    res.status(500).json({
      status: 'unsuccessful',
    });
  }
};

export const authorizeGitHubUser = async (req, res, next) => {
  const githubAuthCode = req.body.code;

  const authorizeURI = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubClientSecret}&code=${githubAuthCode}&redirect_uri=${githubRedirectURL}`;

  var config = {
    method: 'get',
    url: authorizeURI,
  };
  axios(config)
    .then(function (response) {
      const result = processGitHubAuthResponse(response.data);
      if (result === false) {
        const err = new Error('unexpected reponse from github');
        err.code = 'OAUTH-GITHUBDIFFRES';
        throw err;
      } else {
        res.cookie('s-gh', createTokenWithExpiresIn(result, '2h'), {
          httpOnly: true,
          maxAge: gitHubCookieMaxAge,
        });
        res.status(200).json({ status: 'successful' });
      }
    })
    .catch(function (error) {
      console.log(error);
      if (error.code == 'OAUTH-GITHUBDIFFRES') {
        warningLog(
          'GitHub Auth',
          `error while authenticating github user with IP ${req.socket.remoteAddress}`
        );
        res.status(400).json({ status: 'unsuccessful' }).send();
      } else {
        res.status(500).json(error.message).send();
      }
    });

  // try {
  // } catch (error) {
  // }
};
