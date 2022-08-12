module.exports = {
  // status : 200
  // 회원가입 완료
  signUpSuccess: {
    status: 200,
    data: {
      message: "회원가입이 완료되었습니다",
    },
  },
  loginSuccess: {
    status: 200,
    data: {
      type: "cookie",
      message: "로그인이 완료되었습니다",
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
  emailAuthSuccess: {
    status: 200,
    data: {
      message: "인증이 완료되었습니다",
    },
  },
  // status : 400
  // 아이디 중복
  idDuplicate: {
    status: 400,
    data: {
      message: "입력하신 아이디가 중복 되었습니다",
    },
  },
  idNotfound: {
    status: 400,
    data: {
      message: "아이디를 입력하세요",
    },
  },
  passwordNotfound: {
    status: 400,
    data: {
      message: "비밀번호를 입력하세요",
    },
  },
  infoNotfound: {
    status: 400,
    data: {
      message: "입력하신 정보를 찾을 수 없습니다",
    },
  },
  // 이메일 중복
  emailDuplicate: {
    status: 400,
    data: {
      message: "입력하신 이메일이 중복 되었습니다",
    },
  },

  // status : 500
  errorCode: {
    status: 500,
    data: {
      message: "에러가 발생 했습니다",
    },
  },
};
