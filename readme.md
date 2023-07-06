# 소개

추억지도 서버 입니다. 

추억지도는 한 해를 기억하며 다양한 추억을 기록해 친구들과 공유하며 자랑 할 수 있습니다
참여율을 높이기위해 유저별 지도가 있으며 모든 추억을 볼수있는 지도도 있습니다.

## 기술 설명

추억지도 서버는 아래의 핵심 기술을 사용하여 만들어졌습니다.
자세한 패키지는 [package.json](./server/package.json)을 확인해주시면 감사하겠습니다.

- Express.js
  - Parse-server
  - Parse-dashbaord
- PostgreSql

## Server 설정

추억지도 서버는 `Ubuntu 18.04`서버에 `Docker-composer`에 의해 띄워져 운영 중 입니다.

[Nginx Proxy 서버](https://github.com/tjrehdrms123/TIL/blob/main/study/Liunx/Docker/Docker%EB%A5%BC%20%ED%86%B5%ED%95%B4%20Nginx%20proxy%EC%84%9C%EB%B2%84%20%EA%B5%AC%EC%B6%95.md)를 사용중에 있습니다.
![nginx_proxy](./readme_img/nginx_proxy.png)



## ERD(DBeaver)

![전체 추억](./readme_img/erd.PNG)

## 사용 가능한 API

|  EndPoint   | Method |           detail            | done |
| :---------: | :----: | :-------------------------: | :--: |
| user/signup |  POST  |        유저 회원가입        |  ✅  |
| user/login  |  POST  |         유저 로그인         |  ✅  |
| auth/email  |  POST  |         이메일 인증         |  ✅  |
|    page     |  GET   |  추억 데이터 전체 가져오기  |  ✅  |
|  page/:id   |  POST  | 회원의 추억 데이터 가져오기 |  ✅  |
|    page     |  POST  |    추억 데이터 등록하기     |  ✅  |
|  page/:id   | PATCH  |    추억 데이터 수정하기     |  ✅  |
|    page     | PATCH  |    추억 데이터 수정하기     |  ✅  |
|  page/:id   | DELETE |    추억 데이터 삭제하기     |  ✅  |
|    test     |  POST  |         테스트 전용         |  ✅  |

## 2023.07 프로젝트 리뷰

<details>
<summary>코드 리뷰</summary>
<div markdown="1">  
  <ul>
    <li>1. 프로젝트르 완료 후 추가 기능을 추가할때 테스트 코드가 없어서 리팩토링 작업을할때 매우 불안하고 불편했다.</li>
    <li>2. page.js pageListQuery메소드에서 유저에 해당하는 페이지를 조회하는데 <b>Full Table Scan</b>이 되었다. </li>
    <li>
      3. 함수명을 봤을때 정확하게 동작을 추론할 수 없었다.<br/>
      예시로 ID에 해당하는 유저를 조회하는 pageListQuery메소드가 있다 findPageById와 같이 변경하고싶다.
    </li>
     <li>4. 2개 이상의 DB Connection을 연결해 작업하는 API에 Transaction코드가 존재하지 않는다.<li>
    </ul>
  </ul>
</div>
</details>

<details>
<summary>해결한 이슈</summary>
<div markdown="1">   
  <ul>
    <li>[ FSFilesAdapter ]Parse Error: spawn ps ENOENT에러 <br/>
    파일을 업로드 할때 pm2에서 해당 오류가 발생한다. 이유는 pm2를 실행시킬때 --watch 옵션을 줬다. <br/>
    mount된 server폴더에는 files라는 유저가 업로드한 파일 갖고 있는 폴더도 있어서 pm2가 서버를 재시작해 충돌이 나는것으로 확인됐다.<br/>
    해결 방법은 —watch 옵션을 붙히지 않고 pm2 start server.js로 실행 시켰다. 추 후 파일은 AWS S3로 올라가도록 변경했다.</li>
    <li>does not exist" when connecting with PG <br/>create database를 직접 쿼리 날려줘서 해결했다.</li>
    </ul>
      <ul>
    <li>CORS header contains multiple values
    <br/>Nginx, Express 둘다 CORS 설정을하게되면 해당 에러가 발생한다. 둘중 한곳에서만 CORS 설정을 해줘야한다.</li>
    <li>server.js 응답 미들웨어<br/>
    응답 상태 객체를 만들고 상태에 따라 message에 값을 다르게 넣어서 재사용성을 증가시켜서 사용하려고했을때 발견했던 이슈이다.<br/>
    로그인을 했을떄 "refreshToken", "sameSite" 등 message외 추가적인 값을 프로퍼티에 추가해 넘겨줬다.<br/>
    하지만 하나의 객체를 override해서 사용할 경우 다음 요청에 message만 바꾸고 이전 요청에 있던 "refreshToken", "sameSite"등 필요하지 않은 프로퍼티의 값을 제거하지 않으면, 이전 값을 그대로 반환한다.<br/>그래서 응답 미들웨어에 타입을 추가해서 타입이 "cookie" 즉 로그인이면 반환하는 코드를 하나 더 추가했다.
    </li>
  </ul>
</div>
</details>