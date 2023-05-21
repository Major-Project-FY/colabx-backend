// module imports
import axios from 'axios';

// model imports
import { User } from '../models/user.js';
import { gitHubUserInfo } from '../models/other/userGitHubInfo.schema.js';

// importing configs
import { config } from '../config/config.js';

// importing utils
import {} from '../utils/auth/integration.utils.js';
import { checkUserExistByEmail } from '../utils/auth/auth.utils.js';
import { createTokenWithExpiresIn } from '../utils/auth/token.utils.js';
import { warningLog } from '../services/logger/logger.js';
import { log } from '../services/logger/color.logger.js';
import { currentDate } from '../utils/basic/basic.utils.js';

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
  try {
    // github OAuth token exchange code
    const githubAuthCode = req.body.code;

    // GitHub Authorization URI
    const authorizeURI = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubClientSecret}&code=${githubAuthCode}&redirect_uri=${githubRedirectURL}`;

    // initial authorize axios config
    var authorizeConfig = {
      method: 'get',
      url: authorizeURI,
    };

    // calling axios request
    axios(authorizeConfig)
      .then(function (response) {
        // processing github OAuth Response
        const result = processGitHubAuthResponse(response.data);

        // check condition for unvalid response of authorize API
        if (result === false) {
          const err = new Error('unexpected reponse from github');
          err.code = 'OAUTH-GITHUBDIFFRES';
          throw err;
        } else {
          // fetching information of user when scuuessfully authorize
          const infoURI = `https://api.github.com/user`;

          // GitHub info API config
          var infoConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: infoURI,
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: `Bearer ${result.access_token}`,
              'X-GitHub-Api-Version': '2022-11-28',
            },
          };

          // calling GitHub info API
          axios(infoConfig)
            .then(async (response) => {
              // calling user emails GitHub API
              let userEmail = null;
              axios({
                method: 'get',
                maxContentLength: Infinity,
                url: 'https://api.github.com/user/emails',
                headers: {
                  Accept: 'application/vnd.github+json',
                  Authorization: `Bearer ${result.access_token}`,
                  'X-GitHub-Api-Version': '2022-11-28',
                },
              })
                .then(async (emailResponse) => {
                  // checking for user primary email
                  for (let i in emailResponse.data) {
                    if (emailResponse.data[i].primary) {
                      userEmail = emailResponse.data[i].email;
                      break;
                    }
                  }

                  // check if user already there in the database
                  // console.log(userEmail);
                  const userCheckResult = await checkUserExistByEmail(
                    userEmail
                  );
                  if (userCheckResult === false) {
                    // processing user's name from GitHub's name
                    let userFirstName = 'None';
                    let userLastName = '';
                    if (response.data.name) {
                      const nameSplit = response.data.name.split(' ');

                      if (nameSplit.length > 0) {
                        if (nameSplit.length == 1) {
                          userFirstName = nameSplit[0];
                        } else {
                          userFirstName = nameSplit[0];
                          userLastName = nameSplit[nameSplit.length - 1];
                        }
                      }
                    } else {
                      userFirstName = response.data.login;
                    }

                    // creating CollabX user with recieved information
                    User.create({
                      first_name: userFirstName,
                      last_name: userLastName,
                      email: userEmail,
                      password: null,
                      signed_up_through: 'GITHUB',
                      last_login: currentDate(),
                      last_ip_address: req.ip,
                    })
                      .then(async (userCreateResult) => {
                        // console.log('create user results', userCreateResult.dataValues);
                        result.userID = userCreateResult.dataValues.id;

                        // creating new github user info object with collected data
                        const newGitHubUser = new gitHubUserInfo({
                          userID: userCreateResult.dataValues.id,
                          gitHubUsername: response.data.login,
                          email: userEmail,
                          gitHubAvatarUrl: response.data.avatar_url,
                          url: response.data.url,
                          type: response.data.type,
                          name: response.data.name,
                          company: response.data.company,
                          location: response.data.location,
                          twitterUsername: response.data.twitter_username,
                          publicRepos: response.data.public_repos,
                          publicGists: response.data.public_gists,
                          followers: response.data.followers,
                          following: response.data.following,
                          privateGists: response.data.private_gists,
                          totalPrivateRepos: response.data.total_private_repos,
                          ownedPrivateRepos: response.data.owned_private_repos,
                          collaborators: response.data.collaborators,
                          twoFactorAuthentication:
                            response.data.two_factor_authentication,
                        });

                        // asynchronously saving user's data
                        try {
                          await newGitHubUser.save();
                        } catch (error) {
                          throw error;
                        }

                        // setting required headers
                        res.setHeader(
                          'Access-Control-Allow-Headers',
                          'Set-Cookie'
                        );

                        // res.setHeader('SameSite', 'None');

                        // creating session cookie
                        res.cookie(
                          'st',
                          createTokenWithExpiresIn(result, '48h'),
                          {
                            httpOnly: true,
                            maxAge: gitHubCookieMaxAge,
                            sameSite: 'none',
                            secure: false,
                            path: '/',
                            domain: 'collabx.netlify.com',
                          }
                        );

                        // sending response back to client
                        res.status(200).json({ status: 'successful' });
                      })
                      .catch((err) => {
                        // catching error when unable to create CollabX user
                        err.code = 'OAUTH-GITHUBNOUSRCREATE';
                        throw err;
                      });
                  } else if (userCheckResult) {
                    // console.log(
                    //   'userCheckResult',
                    //   userCheckResult.rows[0].dataValues.userID
                    // );
                    result.userID = userCheckResult.rows[0].dataValues.userID;

                    // creating session cookie
                    res.cookie('st', createTokenWithExpiresIn(result, '48h'), {
                      httpOnly: true,
                      maxAge: gitHubCookieMaxAge,
                    });

                    // sending response back to client
                    res.status(200).json({ status: 'successful' });
                  } else {
                    console.log('currentlly nothing here');
                  }
                })
                .catch((err) => {
                  // catching error for not getting emailID of user from GitHub
                  err.code = 'OAUTH-GITHUBNOEMAIL';
                  throw err;
                });
            })
            .catch((err) => {
              // catching error for not getting info of GitHub user
              err.code = 'OAUTH-GITHUBNOINFO';
              throw err;
            });
        }
      })
      .catch(function (error) {
        // logging error
        log.red(`\n! ${error}\n`);

        // handling errors according to their error codes
        if (error.code == 'OAUTH-GITHUBDIFFRES') {
          warningLog(
            'GitHub Auth',
            `error while authenticating github user with IP ${req.ip}`
          );
          res.status(400).json({ status: 'unsuccessful' }).send();
        } else if (error.code == 'OAUTH-GITHUBNOINFO') {
          warningLog(
            'GitHub Auth',
            `error while getting GitHub info of user with IP ${req.ip}`
          );
          res.status(500).json({ status: 'unsuccessful' }).send();
        } else if (error.code == 'OAUTH-GITHUBNOEMAIL') {
          warningLog(
            'GitHub Auth',
            `error while getting GitHub email of user with IP ${req.ip}`
          );
          res.status(500).json({ status: 'unsuccessful' }).send();
        } else if (error.code == 'OAUTH-GITHUBNOUSRCREATE') {
          warningLog(
            'GitHub Auth',
            `error while creating CollabX user from github data of user with IP ${req.ip}`
          );
          res.status(500).json({ status: 'unsuccessful' }).send();
        } else {
          res.status(500).json(error.message).send();
        }
      });
  } catch (error) {
    // handling API response when server crashes
    log.red(`\n! ${error}\n`);
    console.log(error);
    res.status(503).json({
      status: 'server issue',
      msg: 'Unable to process this request at the moment',
    });
  }
};

// API for getting user email
export const getUserEmailforGithub = async (req, res, next) => {
  try {
    const { email } = req.body;
    res.status(200);
    axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api.github.com/user/emails',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer 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`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }).then((response) => {
      console.log(response.data);
    });
  } catch (error) {}
};

// API for getting user's github repositories
export const getUserGitHubRepos = (req, res, next) => {
  const authorizeURI = `https://github.com/users/${username}/repos`;

  var config = {
    method: 'get',
    url: authorizeURI,
  };
  axios(config)
    .then((response) => {})
    .catch((err) => {});
};
