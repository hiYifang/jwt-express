const mongoose = require('mongoose');

// 建立 Schema
const commentSchema = new mongoose.Schema(
  {
    editor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "請填寫創作者 ID"]
    },
    comment: {
      type: String,
      required: [true, '請填寫留言內容'],
    },
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
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;