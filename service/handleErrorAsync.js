const handleErrorAsync = function handleErrorAsync(func) {
  // 先將 async function 帶入參數 func 儲存、middleware 先接住 router 資料
  return function (req, res, next) {
    // 再執行函式，用 catch 統一捕捉
    func(req, res, next).catch(
      function (error) {
        return next(error);
      }
    );
  };
};

module.exports = handleErrorAsync;