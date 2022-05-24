const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();

require('./connections/db');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

// HTTP 狀態碼：404
app.use(function (req, res, next) {
  res.status(404).send('抱歉，您的頁面找不到');
})

// express 錯誤處理
// 上線狀態：自己設定的 err 錯誤
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: "false",
      message: err.message
    });
  } else {
    // log 紀錄
    console.error("出現重大錯誤", err);
    // HTTP 狀態碼：500 -> 送出罐頭預設訊息
    res.status(500).json({
      status: "error",
      message: "系統錯誤，請恰系統管理員"
    });
  }
};

// 開發狀態：開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    field: err.field,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

// error handler middleware
app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  // dev
  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }

  // production
  if (process.env.NODE_ENV === "production") {
    if (err.isAxiosError === true) {
      err.message = "axios 連線錯誤";
      err.isOperational = true;
      return resErrorProd(err, res);
    } else if (err.name === "CastError") {
      // mongoose 無法轉換值
      err.message = "無效的 ID，請重新確認！";
      err.isOperational = true;
      return resErrorProd(err, res);
    } else if (err.name === "SyntaxError") {
      err.statusCode = 400;
      err.message = "語法結構錯誤，請重新確認！";
      err.isOperational = true;
      return resErrorProd(err, res);
    }
    return resErrorProd(err, res);
  }
});

// 程式出現重大錯誤：uncaughtException
process.on("uncaughtException", (err) => {
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// 未捕捉到的 catch：unhandledRejection
process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕捉到的 rejection：", promise);
  console.error("原因：", reason);
});

module.exports = app;
