const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

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
      return next(appError(400, "註冊失敗，請填寫暱稱欄位", "nickName", next))
    } else if (!validator.isLength(nickName, { min: 2 })) {
      return next(appError(400, "暱稱至少 2 個字元以上", "nickName", next))
    }

    if (!email) {
      return next(appError(400, "註冊失敗，請填寫 Email 欄位", "email", next))
    } else if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式錯誤，請重新填寫 Email 欄位", "email", next))
    } else if (emailExist) {
      return next(appError(400, "Email 已被註冊，請替換新的 Email", "email", next))
    }

    if (!password) {
      return next(appError(400, "註冊失敗，請填寫 Password 欄位", "password", next))
    } else if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, "密碼需至少 8 碼以上，並英數混合", "password", next))
    }

    password = await bcrypt.hash(req.body.password, 12); // 加密密碼
    const newEditor = await User.create({
      email,
      password,
      nickName
    });
    generateSendJWT(newEditor, 201, res);
  }),
  signIn: handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
      return next(appError(400, "登入失敗，請重新填寫 Email 欄位", "email", next))
    } else if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式錯誤，請重新填寫 Email 欄位", "email", next))
    }

    if (!password) {
      return next(appError(400, "登入失敗，請重新填寫 Password 欄位", "password", next))
    }

    const editor = await User.findOne({ email }).select('+password'); // 顯示密碼
    const auth = await bcrypt.compare(password, editor.password); // 比對密碼
    if (!auth) {
      return next(appError(400, "登入失敗，密碼不正確", "password", next))
    }
    generateSendJWT(editor, 201, res);
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    if (!password) {
      return next(appError(400, "設定失敗，請填寫 Password 欄位", "password", next))
    } else if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, "密碼需至少 8 碼以上，並英數混合", "password", next))
    } else if (!confirmPassword) {
      return next(appError(400, "設定失敗，請填寫 confirmPassword 欄位！", "confirmPassword", next));
    } else if (!validator.equals(confirmPassword, password)) {
      return next(appError(400, "驗證失敗，密碼不一致！", "", next));
    }

    newPassword = await bcrypt.hash(password, 12); // 加密密碼
    const editor = await User.findByIdAndUpdate(req.editor._id, {
      password: newPassword
    });
    res.status(201).json({
      status: 'success',
      message: '修改密碼成功!'
    });
  }),
  getProfile: handleErrorAsync(async (req, res, next) => {
    const editorId = req.params.id;
    const editorExist = await User.findById(editorId);

    if (!editorExist) {
      return next(appError(400, "尚未註冊為會員", "_id", next))
    }

    const following = await Follow.find({ following: editorId }).count();

    res.status(200).json({
      status: 'success',
      editor: req.editor,
      following: following
    });
  }),
  patchProfile: handleErrorAsync(async (req, res, next) => {
    const editorId = req.params.id;
    const editorExist = await User.findById(editorId);
    const { nickName, gender, avatar } = req.body;

    if (!editorExist) {
      return next(appError(400, "尚未註冊為會員", "_id", next))
    }

    if (!nickName) {
      return next(appError(400, "更新失敗，請填寫暱稱欄位", "nickName", next))
    } else if (!validator.isLength(nickName, { min: 2 })) {
      return next(appError(400, "暱稱至少 2 個字元以上", "nickName", next))
    } else if (avatar && !avatar.startsWith('https')) {
      return next(appError(400, "更新失敗，請確認大頭照的圖片網址", "avatar", next));
    }

    const editor = await User.findByIdAndUpdate(editorId, {
      nickName,
      gender,
      avatar
    });
    res.status(201).json({
      status: 'success',
      message: '更新個人資料成功!'
    });
  })
}

module.exports = users;
