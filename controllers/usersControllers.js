const mongoose = require('mongoose');
const { appError, handleErrorAsync } = require('../service/errorHandler');
const getHttpResponse = require('../service/successHandler');

const bcrypt = require('bcryptjs');
const validator = require('validator');
const { generateSendJWT } = require('../service/auth');

const User = require('../models/usersModel');
const Follow = require('../models/followsModel');

const users = {
  signUp: handleErrorAsync(async (req, res, next) => {
    let { email, password, nickName } = req.body;
    const emailExist = await User.findOne({ email });

    if (!nickName) {
      return next(appError(400, "註冊失敗，請填寫暱稱欄位", "nickName"))
    } else if (!validator.isLength(nickName, { min: 2 })) {
      return next(appError(400, "暱稱至少 2 個字元以上", "nickName"))
    }

    if (!email) {
      return next(appError(400, "註冊失敗，請填寫 Email 欄位", "email"))
    } else if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式錯誤，請重新填寫 Email 欄位", "email"))
    } else if (emailExist) {
      return next(appError(400, "Email 已被註冊，請替換新的 Email", "email"))
    }

    if (!password) {
      return next(appError(400, "註冊失敗，請填寫 Password 欄位", "password"))
    } else if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, "密碼需至少 8 碼以上，並英數混合", "password"))
    }

    password = await bcrypt.hash(req.body.password, 12); // 加密密碼
    const newUser = await User.create({
      email,
      password,
      nickName
    });
    generateSendJWT(newUser, 201, res);
  }),
  signIn: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
      return next(appError(400, "登入失敗，請重新填寫 Email 欄位", "email"))
    } else if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式錯誤，請重新填寫 Email 欄位", "email"))
    }

    if (!password) {
      return next(appError(400, "登入失敗，請重新填寫 Password 欄位", "password"))
    }

    const user = await User.findOne({ email }).select('+password'); // 顯示密碼
    const auth = await bcrypt.compare(password, user.password); // 比對密碼
    if (!auth) {
      return next(appError(400, "登入失敗，密碼不正確", "password"))
    }
    generateSendJWT(user, 201, res);
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { user, body: { password, confirmPassword } } = req;

    if (!password) {
      return next(appError(400, "設定失敗，請填寫 Password 欄位", "password"))
    } else if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, "密碼需至少 8 碼以上，並英數混合", "password"))
    } else if (!confirmPassword) {
      return next(appError(400, "設定失敗，請填寫 confirmPassword 欄位！", "confirmPassword"));
    } else if (!validator.equals(confirmPassword, password)) {
      return next(appError(400, "驗證失敗，密碼不一致！", ""));
    }

    newPassword = await bcrypt.hash(password, 12); // 加密密碼
    await User.updateOne({ _id: user._id }, { password: newPassword });
    res.status(201).json(getHttpResponse({ message: "更新密碼成功" }));
  }),
  getProfile: handleErrorAsync(async (req, res, next) => {
    res.status(200).json(getHttpResponse(req.user));
  }),
  patchProfile: handleErrorAsync(async (req, res, next) => {
    const { user, body: { nickName, gender, avatar } } = req;

    if (!nickName) {
      return next(appError(400, "更新失敗，請填寫暱稱欄位", "nickName"))
    } else if (!gender) {
      return next(appError(400, "更新失敗，請填寫性別欄位", "gender"))
    } else if (!validator.isLength(nickName, { min: 2 })) {
      return next(appError(400, "暱稱至少 2 個字元以上", "nickName"))
    } else if (avatar && !avatar.startsWith('https')) {
      return next(appError(400, "更新失敗，請確認大頭照的圖片網址", "avatar"));
    }

    await User.findByIdAndUpdate(user._id, { nickName, gender, avatar });
    res.status(201).json(getHttpResponse({ message: "更新個人資料成功" }));
  })
}

module.exports = users;
