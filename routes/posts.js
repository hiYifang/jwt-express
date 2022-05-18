const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/postsControllers');

// 觀看所有動態
router.get('/', isAuth, (req, res, next) => {
  PostsControllers.getPosts(req, res, next);
});

// 張貼個人動態
router.post('/', isAuth, (req, res, next) => {
  PostsControllers.insertPost(req, res, next);
});

module.exports = router;