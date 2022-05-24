const mongoose = require('mongoose');

// 建立 Schema
const followSchema = new mongoose.Schema(
  {
    // 設計稿 4.追蹤名單
    editor: { // 自己
      type: mongoose.Schema.ObjectId,
      ref: "User",
      select: false
    },
    following: { // 別人
      type: mongoose.Schema.ObjectId,
      ref: "User"
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
const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;