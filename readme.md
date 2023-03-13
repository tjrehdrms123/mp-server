# 소개

추억지도 서버 입니다. 

추억지도는 한 해를 기억하며 다양한 추억을 기록해 친구들과 공유하며 자랑 할 수 있습니다
참여율을 높이기위해 유저별 지도가 있으며 모든 추억을 볼수있는 지도도 있습니다.

## 기술 설명

추억지도 서버는 아래의 핵심 기술을 사용하여 만들어졌습니다.
자세한 패키지는 `package.json`을 확인해주시면 감사하겠습니다.

- Express.js
  - Parse-server
  - Parse-dashbaord
- PostgreSql

## Devops 설정

추억지도 서버는 `Docker`에 띄워지게 설계되어져 있습니다.
`server`폴더를 mount하여 사용합니다.
자세한 설정은 [해당 git](https://github.com/tjrehdrms123/mp-cloudserver)을 참고하여 주시면 감사하겠습니다.

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

## 프로젝트 리뷰

<details>
<summary>코드 리뷰</summary>
<div markdown="1">  
  <ul>
    <li><b>테스트 코드</b> : 를 작성할때 테스트 용 라우트를 만들어서 실제 코드가 잘 동작되는지 테스트를 진행 했었다. 하지만 `jest`라는 테스트 프레임워크가 있어서 다음 프로젝트에서 도입해봐야겠다.</li>
    <li><b>Try & Catch</b> : 를 예외를 잡아서 Client에 보내주기 위해서만 사용하는 줄 알고있었다. 그래서 예외가 발생할수 있겠다.라는 곳에만 Try & Catch를 넣어서 예외처리를 해줬다. 하지만 생각지 못한 예외가 발생했을때 예외 처리로직을 넣어놓지 않아서 서버가 죽는 이슈가 있었다.</li>
    <li><b>equalToQuery</b> : ParseServer를 사용하면서 API를 예외처리를 할때 아래처럼 테이블을 new 키워드를 사용해 인스턴스화 한 후 원하는 메소드를 사용해 예외처리를한다. 예외처리할 값이 인스턴스화 한 값에 있다면 `query.email`, `query.name`등으로 조회하면 된다. 하지만 값이 없다면 new키워드를 사용해 계속 인스턴스화 해서 사용해야된다. 그런점이 불편해 equalToQuery함수를 만들었다. 해당 함수는 value파라미터의 갯수만큼 인스턴스화 한 후 배열로 리턴한다 그렇게 된다면 위 부분을 해결할 수 있다.
    </li>
  </ul>
</div>
</details>

<details>
<summary>코드 스멜</summary>
<div markdown="1">   
  <ul>
    <li>응답 코드에 따라 응답 미들웨어에서 다르게 return했다. 하지만 해당 코드가 맞는 코드인지, 기능에 대한 욕심 때문에 작성된 코드가 아닌지 의심이 계속 든다.</li>
    </ul>
  </ul>
</div>
</details>

<details>
<summary>해결한 이슈</summary>
<div markdown="1">   
  <ul>
    <li><b>[ FSFilesAdapter ]Parse Error: spawn ps ENOENT</b> : 파일을 업로드 할때 pm2에서 해당 오류가 발생한다. 이유는 pm2를 실행시킬때 --watch 옵션을 줬다. mount된 server폴더에는 files라는 유저가 업로드한 파일 갖고 있는 폴더도 있어서 pm2가 서버를 재시작해 충돌이 나는것으로 확인됐다. 해결 방법은 —watch 옵션을 붙히지 않고 pm2 start server.js로 실행 시켰다. 추 후 파일은 AWS S3로 올라가도록 변경했다.</li>
    <li><b>does not exist" when connecting with PG</b> : create database를 직접 쿼리 날려줘서 해결했다.</li>
    </ul>
      <ul>
    <li><b>CORS header contains multiple values</b> : Nginx, Express 둘다 CORS 설정을하게되면 해당 에러가 발생한다. 둘중 한곳에서만 CORS 설정을 해줘야한다.</li>
    <li><b>server.js 응답 미들웨어</b> : 응답 상태 객체를 만들고 상태에 따라 message에 값을 다르게 넣어서 재사용성을 증가시켜서 사용하려고했을때 발견했던 이슈이다. 로그인을 했을떄 "refreshToken", "sameSite" 등 message외 추가적인 값을 프로퍼티에 추가해 넘겨줬다. 하지만 하나의 객체를 override해서 사용할 경우 다음 요청에 message만 바꾸고 이전 요청에 있던 "refreshToken", "sameSite"등 필요하지 않은 프로퍼티의 값을 제거하지 않으면, 이전 값을 그대로 반환한다. 그래서 응답 미들웨어에 타입을 추가해서 타입이 "cookie" 즉 로그인이면 반환하는 코드를 하나 더 추가했다.
    </li>
  </ul>
</div>
</details>

```js
# 코드 리뷰 : equalToQuery

# 기존 ParseServer 방식
let nameQuery = new Parse.Query("User");
query.equalTo("name", "example");
let emailQuery = new Parse.Query("User");
query.equalTo("email", "example@test.com");

# 개선한 equalToQuery 방식
const userInfo = await equalToQuery(
  User,
  ["name", "email"],
  ["example", "example@test.com"]
);
```
