const { appError, handleErrorAsync } = require('../service/errorHandler');
const getHttpResponse = require('../service/successHandler');

const validator = require('validator');

const User = require('../models/usersModel');
const Post = require('../models/postsModel');
const Comment = require('../models/commentsModel');

const posts = {
  getPosts: handleErrorAsync(async (req, res, next) => {
    const { q, sort = 'desc' } = req.query;
    const filter = q ? { content: new RegExp(q) } : {};
    const posts = await Post.find(filter)
      .populate({
        path: "editor",
        select: "nickName avatar"
      })
      .populate({
        path: "comments",
        populate: {
          path: "editor",
          select: "nickName avatar"
        },
      })
      .sort({ createdAt: sort === 'desc' ? -1 : 1 });
    res.status(200).json(getHttpResponse(posts));
  }),
  insertPost: handleErrorAsync(async (req, res, next) => {
    const { user, body: { content, image } } = req;

    // 判斷圖片開頭是否為 http
    if (image && image.length > 0) {
      image.forEach(function (item, index, array) {
        let result = item.split(":");
        if (!validator.equals(result[0], 'https')) {
          return next(appError(400, ' 格式錯誤', ' 圖片格式不正確！'));
        }
      });
    }

    if (!content)
      return next(appError(400, ' 格式錯誤', ' 欄位未填寫正確！'));

    const newPost = await Post.create({ editor: user, content, image });


    res.status(201).json(getHttpResponse(newPost));
  })
}

module.exports = posts;
