const express = require('express');
const User = require('../models/usersModel');

const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');

const jwt = require('jsonwebtoken');

const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(appError(401, '請輸入帳號密碼進行登入！', "", next));
  }

  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err)
      } else {
        resolve(payload)
      }
    })
  })

  const currentEditor = await User.findById(decoded.id);
  req.editor = currentEditor; // 自訂屬性，傳到下一個 middleware
  next();
});

const generateSendJWT = (editor, statusCode, res) => {
  // 產生 JWT token
  const token = jwt.sign({ id: editor._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  });
  editor.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    data: {
      token: token,
      nickName: editor.nickName,
      id: editor._id
    }
  });
}

module.exports = {
  isAuth,
  generateSendJWT
}

