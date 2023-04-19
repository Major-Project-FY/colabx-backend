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
export const getGitHubRepoCollaborators = (gitHubUser, repoName, token) => {
  return new Promise((resolve, reject) => {
    const URL = `https://api.github.com/repos/${gitHubUser}/${repoName}/collaborators?per_page=100&page=1`;
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
        for (let i in res.data) {
          data.push({
            contributorGitHubUserName: res.data[i].login,
            avtarURL: res.data[i].avatar_url,
          });
        }
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// helper function that gets contributors for a given repository
export const getGitHubRepoContributors = (gitHubUser, repoName, token) => {
  return new Promise((resolve, reject) => {
    const URL = `https://api.github.com/repos/${gitHubUser}/${repoName}/contributors?per_page=100&page=1`;
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
        for (let i in res.data) {
          data.push({
            contributorGitHubUserName: res.data[i].login,
            avtarURL: res.data[i].avatar_url,
            contributions: res.data[i].contributions,
          });
        }
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getGithubRepoLanguages = (gitHubUsername, repoName, token) => {
  return new Promise((resolve, reject) => {
    const URL = `https://api.github.com/repos/${gitHubUsername}/${repoName}/languages`;
    const urlConfig = {
      method: 'get',
      url: URL,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    };
    axios(urlConfig)
      .then((resposne) => {
        resolve(resposne.data);
      })
      .catch((error) => reject(error));
  });
};

// helper function that processes the repositories info recieved
export const processAndSyncRepoInfo = async (
  info,
  userID,
  gitHubUsername,
  token
) => {
  console.log('info received', userID);
  let finalData = [];
  const promises = info.map(async (repo) => {

    const repoObject = {
      userID: userID,
      repoName: repo.name,
      repoFullName: repo.full_name,
      private: repo.private,
      ownerUsername: repo.owner.login,
      htmlURL: repo.html_url,
      description: repo.description,
      fork: repo.fork,
      url: repo.url,
      forksURL: repo.forks_url,
      collaborators: await getGitHubRepoCollaborators(
        repo.owner.login,
        repo.name,
        token
      ),
      languages: await getGithubRepoLanguages(
        repo.owner.login,
        repo.name,
        token
      ),
      contributors: await getGitHubRepoContributors(
        repo.owner.login,
        repo.name,
        token
      ),
      repoCreatedAt: repo.created_at,
      repoUpdatedAt: repo.updated_at,
      repoPushedAt: repo.pushed_at,
      gitURL: repo.git_url,
      sshURL: repo.ssh_url,
      cloneIRL: repo.clone_url,
      repoSize: repo.size,
      mainLanguage: repo.language,
      forksCount: repo.forks_count,
      archived: repo.archived,
      disabled: repo.disabled,
      openIssuesCount: repo.open_issues_count,
      license: repo.license,
      allowForking: repo.allow_forking,
      topics: repo.topics,
      visibility: repo.visibility,
      forks: repo.forks,
      defaultBranch: repo.default_branch,
      permissions: repo.permissions,
    };
    finalData.push(repoObject);
  });
  await Promise.all(promises);
  await gitHubUserRepos.deleteMany({ userID: userID });
  const insertResult = await gitHubUserRepos.insertMany(finalData);
  return insertResult;
};
