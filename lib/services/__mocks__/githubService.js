/* eslint-disable no-unused-vars */
const exchangeCodeForToken = async (code) => {
  return 'mock  token for code';
};

const getGithubProfile = async (token) => {
  return {
    login: 'fake_github_user',
    avatar: 'https://www.placecage.com/gif',
    email: 'not-real@example.com',
  };
};

module.exports = { exchangeCodeForToken, getGithubProfile };
