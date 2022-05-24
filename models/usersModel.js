const mongoose = require('mongoose');

// 建立 Schema
const usersSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: [true, '請填寫暱稱']
    },
    gender: {
      // 男性: 0，女性: 1，跨性別: 2
      type: Number,
      default: 0,
      enum: [0, 1, 2]
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "請填寫 Email"],
      unique: true,
      lowercase: true,
      select: false
    },
    password: {
      type: String,
      required: [true, "請填寫密碼"],
      minlength: 8,
      select: false
    },
    createdAt: { // 建立時間
      type: Date,
      default: Date.now,
      select: false
    },
    updatedAt: { // 更新時間
      type: Date,
      default: Date.now,
      // select: false
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
const User = mongoose.model('User', usersSchema);

module.exports = User;