// API
const signupAPI = "http://localhost:3601/user/signup"; // 회원가입
const emailAPI = "http://localhost:3601/auth/email"; // 이메일
const loginAPI = "http://localhost:3601/user/login"; // 로그인
const getPageAllAPI = "http://localhost:3601/page"; // 글 요청

// Redirect
const authEmailUrl = "http://localhost:3601/leeheeseung/email"; // 이메일 인증
const loginUrl = "http://localhost:3601/leeheeseung/login"; // 로그인
const adminUrl = "http://localhost:3601/leeheeseung/email"; // 관리자

const signupBtn = document.querySelector('.signup_submit');
const emailBtn = document.querySelector('.email_submit');
const loginBtn = document.querySelector('.login_submit');
const mainBtn = document.querySelector('.main_submit');
try {
    /**
     * @description JWT키를 받고 있다면 axios 헤더에 accessToken을 설정하는 함수
     * @param {JWT accessToken} accessToken 
     */
    const localStorageAccessToken = localStorage.getItem('accessToken');  
    if(localStorageAccessToken){
        axios.defaults.headers.common["Authorization"] = `Bearer ${localStorageAccessToken}`;
    }

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
try{
    // if(kakao){
    //     var map = new kakao.maps.Map(document.getElementById('map'), { // 지도를 표시할 div
    //         center : new kakao.maps.LatLng(37.566812940227386, 126.9786522620371), // 지도의 중심좌표 
    //         level : 9 // 지도의 확대 레벨 
    //     });
    
    //     var clusterer = new kakao.maps.MarkerClusterer({
    //         map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    //         averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    //         minLevel: 5 // 클러스터 할 최소 지도 레벨 
    //     });
    // }    
            console.log(axios.defaults.headers.common["Authorization"]);
            axios.get(getPageAllAPI,{}).then((data) => {
                console.log(data);
                // var markers = data.positions.map(function(i, position) {
                //     return new kakao.maps.Marker( {position : new kakao.maps.LatLng(position.lat, position.lng), 
                //     image: new kakao.maps.MarkerImage(position.markerimg, new kakao.maps.Size(60, 60), 
                //     {offset: new kakao.maps.Point(12, 34)})});
                // });
                // console.log('marker :', markers);
                // lusterer.addMarkers(markers);
            })
} catch(e){
    console.log(e);
}