const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/usersControllers');
const { isAuth } = require('../service/auth');

// 註冊
router.post('/sign_up', UsersControllers.signUp);

// 登入
router.post('/sign_in', UsersControllers.signIn);

// 重設密碼
router.post('/updatePassword', isAuth, UsersControllers.updatePassword);

// 取得個人資料
router.get('/profile', isAuth, UsersControllers.getProfile);

// 更新個人資料
router.patch('/profile', isAuth, UsersControllers.patchProfile);

module.exports = router;
