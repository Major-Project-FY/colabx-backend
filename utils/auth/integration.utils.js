// modules import
import axios from 'axios';
import { config } from '../../config/config.js';

// models import
import { gitHubUserRepos } from '../../models/other/githubRepos.schema.js';

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

// helper function that gets github user's all repositories
export const getUserAllRepos = (username, token) => {
  return new Promise((resolve, reject) => {
    const URL = `https://api.github.com/users/${username}/repos`;
    var urlConfig = {
      method: 'get',
      url: URL,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    };
    axios(urlConfig)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// helper function that gets collaborators for a given repository
export const getGitHubRepoContributors = (repoName, gitHubUser, token) => {
  return new Promise((resolve, reject) => {
    const URL = `https://api.github.com/repos/${gitHubUser}/${repoName}/contributors?per_page=100&page=1`;
    console.log('url', URL);
    let urlConfig = {
      method: 'get',
      url: URL,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    };
    urlConfig.url = URL;
    axios(urlConfig)
      .then((res) => {
        const data = [];
        // console.log(res.data[0].login);
        // console.log('total ', res.headers.get('Total'));
        // if (repoName == 'android_kernel_xiaomi_msm8917') {
        //   console.log(res);
        // }
        for (let i in res.data) {
          data.push({
            contributorGitHubUserName: res.data[i].login,
            avtarURL: res.data[i].avatar_url,
            contributions: res.data[i].contributions,
          });
        }
        console.log(data);
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// helper function that processes the repositories info recieved
export const processAndSyncRepoInfo = async (
  info,
  userID,
  gitHubUsername,
  token
) => {
  console.log('info recieved', userID);
  let finalData = [];
  for (let i in info) {
    // const contributors = await getGitHubRepoContributors(
    //   info[i].name,
    //   gitHubUsername,
    //   token
    // );
    const repoObject = {
      userID: userID,
      repoName: info[i].name,
      repoFullName: info[i].full_name,
      private: info[i].private,
      ownerUsername: info[i].owner.login,
      htmlURL: info[i].html_url,
      description: info[i].description,
      fork: info[i].fork,
      url: info[i].url,
      forksURL: info[i].forks_url,
      collaborators: {},
      languages: {},
      contributors: {},
      repoCreatedAt: info[i].created_at,
      repoUpdatedAt: info[i].updated_at,
      repoPushedAt: info[i].pushed_at,
      gitURL: info[i].git_url,
      sshURL: info[i].ssh_url,
      cloneIRL: info[i].clone_url,
      repoSize: info[i].size,
      mainLanguage: info[i].language,
      forksCount: info[i].forks_count,
      archived: info[i].archived,
      disabled: info[i].disabled,
      openIssuesCount: info[i].open_issues_count,
      license: info[i].license,
      allowForking: info[i].allow_forking,
      topics: info[i].topics,
      visibility: info[i].visibility,
      forks: info[i].forks,
      defaultBranch: info[i].default_branch,
      permissions: info[i].permissions,
    };
    finalData.push(repoObject);
  }
  await gitHubUserRepos.deleteMany({ userID: userID });
  const insertResult = await gitHubUserRepos.insertMany(finalData);
  return insertResult;
};
