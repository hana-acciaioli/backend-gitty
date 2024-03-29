const { Router } = require('express');
const Post = require('../models/Post');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const posts = await Post.getAll();
      res.json(posts);
    } catch (e) {
      next(e);
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const newPost = await Post.insert(req.body);
      res.json(newPost);
    } catch (e) {
      next(e);
    }
  });
