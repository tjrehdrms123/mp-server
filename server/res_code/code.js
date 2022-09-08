module.exports = {
  // * Status : 200
  successCode: {
    status: 200,
    data: {
      message: "",
    },
  },
  successPageCode: {
    status: 200,
    data: {},
  },
  successTokenCode: {
    status: 200,
    data: {
      type: "cookie",
      message: "",
    },
  },
  loginToken: {
    data: {
      // cookie에 refreshToken 전송
      refreshToken: "",
      sameSite: "", // 도메인 검증 (none일 때 secure: true 필수)
      secure: "", // https에서만 사용
      httpOnly: "", // 브라우저에서 쿠키 접근
    },
  },
  // * Status : 400
  requestErrorCode: {
    status: 400,
    data: {
      message: "",
    },
  },
  // * Status : 500
  errorCode: {
    status: 500,
    data: {
      message: "",
    },
  },
};
