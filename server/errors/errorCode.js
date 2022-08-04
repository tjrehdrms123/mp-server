module.exports = {
  // 401 Error
  invalidToken: {
    status: 401,
    content: "잘못된 토큰입니다.",
    errorCode: "MP401000",
  },
  notVerifyUser: {
    status: 401,
    content: "인증 절차가 이루어지지 않은 유저입니다.",
    errorCode: "MP401003",
  },

  // 500 Error
  unknownError: {
    status: 500,
    content: "알 수 없는 오류가 발생하였습니다.",
    errorCode: "MP999999",
  },
};
