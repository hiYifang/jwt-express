const mongoose = require('mongoose');

// 建立 Schema
const postsSchema = new mongoose.Schema(
  {
    editor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "請填寫創作者 ID"]
    },
    content: {
      type: String,
      required: [true, '請填寫貼文內容'],
    },
    image: {
      type: [String],
    },
    // 設計稿 8.我按讚的貼文
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: "User"
    }],
    // 留言
    comments:[{
      type: mongoose.Schema.ObjectId,
      ref: "Comment"
    }],
    createdAt: { // 建立時間
      type: Date,
      default: Date.now
    },
    updatedAt: { // 更新時間
		  type: Date,
		  default: Date.now,
    },
		// true: 隱藏資料、false: 顯示在畫面上
    logicDeleteFlag: {
	    type: Boolean,
	    default: false,
	  },
  },
  {
    versionKey: false
  }
);

// 建立 Model
const Post = mongoose.model('Post', postsSchema);

module.exports = Post;