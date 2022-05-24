const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

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
    res.status(200).json({
      status: "success",
      data: posts
    });
  }),
  insertPost: handleErrorAsync(async (req, res, next) => {
    const editorId = req.params.id;
    const editorExist = await User.findById(editorId);
    const { editor, body: { content, image } } = req;

    if (!editorExist) {
      return next(appError(400, "尚未註冊為會員", "_id", next))
    }

    if (!content)
    return next(appError(400, "新增失敗，請確認貼文的內容欄位", "content", next));

    // 判斷圖片開頭是否為 http
    if (image && image.length > 0) {
      image.forEach(function (item, index, array) {
        let result = item.split(":");        
        if (!validator.equals(result[0], 'https')) {
          return next(appError(400, "新增失敗，請確認貼文的圖片網址", "image", next));
        }
      });
    }

    // 新增至 model，先固定使用者 ID
    // const editorId = '627712107054bea4d244740a';
    const newPost = await Post.create({
      editor: editor._id,
      content,
      image
    });
    res.status(200).json({
      status: "success",
      data: newPost
    });
  })
}

module.exports = posts;
