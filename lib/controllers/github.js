const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const {
  exchangeCodeForToken,
  getGithubProfile,
} = require('../services/githubService');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`
    );
  })
  .get('/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      const token = await exchangeCodeForToken(code);
      const { email, login, avatar } = await getGithubProfile(token);
      let user = await GithubUser.findByLogin(login);
      if (!user) {
        user = await GithubUser.insert({
          login,
          email,
          avatar,
        });
      }
      const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect('/api/v1/github/dashboard');
    } catch (error) {
      next(error);
    }
  })
  .get('/dashboard', [authenticate], (req, res, next) => {
    try {
      res.json(req.user);
    } catch (e) {
      next(e);
    }
  })
  .delete('/', (req, res, next) => {
    try {
      res
        .clearCookie(process.env.COOKIE_NAME, {
          httpOnly: true,
          secure: process.env.SECURE_COOKIES === 'true',
          sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
          maxAge: ONE_DAY_IN_MS,
        })
        .status(204)
        .send();
    } catch (e) {
      next(e);
    }
  });
