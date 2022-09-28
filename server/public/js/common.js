// API
const signupAPI = "http://localhost:3601/user/signup"; // 회원가입
const emailAPI = "http://localhost:3601/auth/email"; // 이메일
const loginAPI = "http://localhost:3601/user/login"; // 로그인

// Redirect
const authEmailUrl = "http://localhost:3601/leeheeseung/email"; // 이메일 인증
const loginUrl = "http://localhost:3601/leeheeseung/login"; // 로그인
const adminUrl = "http://localhost:3601/leeheeseung/email"; // 관리자

const signupBtn = document.querySelector('.signup_submit');
const emailBtn = document.querySelector('.email_submit');
const loginBtn = document.querySelector('.login_submit');
try {
    /**
     * @description JWT키를 받고 있다면 axios 헤더에 accessToken을 설정하는 함수
     * @param {JWT accessToken} accessToken 
     */

    function setAuthorizationToken(accessToken) {      
        if(accessToken){
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        } else {
            axios.defaults.headers.common["Authorization"]
        }        
    }

    if(signupBtn){
        signupBtn.addEventListener('click', () => {
            const name = document.querySelector('.name').value;
            const uid = document.querySelector('.uid').value;
            const password = document.querySelector('.password').value;
            const email = document.querySelector('.email').value;
            axios.post(signupAPI, {
                "uid": uid,
                "password": password,
                "name": name,
                "email": email,
                "auth_type": 0
            }).then((result) => {
                const { data, status } = result.data;
                if (status === 200) {
                    alert(`${data.name}님 ${data.message}`);
                    alert(`${data.name}님 이메일 인증을 진행 해주세요`);
                    location.href=`${authEmailUrl}`;
                } else {
                    alert(`Error : ${data.message}`);
                }
            })
        })
    }
    if(emailBtn){
        emailBtn.addEventListener('click', () => {
            const email = document.querySelector('.email').value;
            console.log(`email ${email}`);
            axios.post(emailAPI, {
                "email": email,
            }).then((result) => {
                const { data, status } = result.data;
                if (status === 200) {
                    alert(`${data.message}`);
                    alert(`이메일 인증 코드를 확인해주세요`);
                    location.href=`${loginUrl}`;
                } else {
                    alert(`Error : ${data.message}`);
                }
            })
        })
    }
    if(loginBtn){
        loginBtn.addEventListener('click', () => {
            const uid = document.querySelector('.uid').value;
            const password = document.querySelector('.password').value;
            const emailAuthCode = document.querySelector('.email_auth_code').value;
            axios.post(loginAPI, {
                "uid": uid,
                "password": password,
                "email_auth_code": emailAuthCode,
                "auth_type": 0
            }).then((result) => {
                const { data, status } = result.data;
                const accessToken = data.accessToken;
                if (status === 200) {
                    localStorage.setItem('accessToken',accessToken);
                    setAuthorizationToken(accessToken);
                    alert(`${data.message}`);
                    // location.href=`${adminUrl}`;
                } else {
                    alert(`Error : ${data.message}`);
                }
            })
        })
    }
} catch (e) {
    console.log(e);
}
