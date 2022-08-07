module.exports = {
  // status : 200
  // 회원가입 완료
  signUpSuccess: {
    status: 200,
    data: {
      content: "회원가입이 완료되었습니다",
    },
  },

  // status : 400
  // 아이디 중복
  idDuplicate: {
    status: 400,
    data: {
      content: "입력하신 아이디가 중복 되었습니다",
    },
  },
  // 이메일 중복
  emailDuplicate: {
    status: 400,
    data: {
      content: "입력하신 이메일이 중복 되었습니다",
    },
  },

  // status : 500
  errorCode: {
    status: 500,
    data: {},
  },
};
