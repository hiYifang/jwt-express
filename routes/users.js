const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/usersControllers');
const isAuth = require('../service/auth');

// 註冊
router.post('/sign_up', (req, res, next) => {
  UsersControllers.signUp(req, res, next);
});

// 登入
router.post('/sign_in', (req, res, next) => {
  UsersControllers.signIn(req, res, next);
});

// 重設密碼
router.post('/updatePassword', isAuth, (req, res, next) => {
  UsersControllers.updatePassword(req, res, next);
});

// 取得個人資料
router.post('/profile', isAuth, (req, res, next) => {
  UsersControllers.getProfile(req, res, next);
});

// 更新個人資料
router.patch('/profile', isAuth, (req, res, next) => {
  UsersControllers.patchProfile(req, res, next);
});

module.exports = router;
