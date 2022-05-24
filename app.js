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

/* 錯誤處理 */
require('./service/process');
const { errorHandlerMainProcess } = require('./service/errorHandler');
app.use(errorHandlerMainProcess);

module.exports = app;
