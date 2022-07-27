# MP-SERVER

## Parse-server 설치
### package.json파일에서 해당 패키지는 필수로 설치해야된다
```js
    "express": "^4.17.2",
    "parse-dashboard": "^3.2.1",
    "parse-server": "^4.10.4",
```

### parse서버 구동 파일인 server.js파일을 작성한다
```js
const express = require('express');
const { default: ParseServer, ParseGraphQLServer } = require('parse-server');
const config = require('./config')

const app = express();

const parseServer = new ParseServer({
    databaseURI: config.databaseURI,
    appId: config.parseAppId,
    masterKey: config.parseMasterKey,
    clientKey: config.parseClientKey,
    restAPIKey: config.parseRestAPIKey,
    javascriptKey: config.parseJavascriptKey,
    port: config.port
});

const ParseDashboard = require('parse-dashboard');
const dashboard = new ParseDashboard({
    apps: [
        {
            appId: config.parseAppId,
            appName: config.parseAppName,
            serverURL: config.parseServerURL,
            masterKey: config.parseMasterKey,
            javascriptKey: config.parseJavascriptKey
        }
    ],
    users: [
        config.parseDashboardAdmin
    ]
}, {allowInsecureHTTP: true});

app.use('/parse', parseServer.app);
app.use('/dashboard', dashboard)

app.listen(config.port, () => {
    console.log('server is running');
})
```

### parse서버 설정 파일 config.js을 작성한다
```js
const PORT = 3601;
const config = {
  databaseURI: "postgres://db_user:password@db_host/db_name",
  parseAppId: "sample",
  parseAppName: "sample",
  parseMasterKey: "sample",
  parseClientKey: "sample",
  parseRestAPIKey: "sample",
  parseJavascriptKey: "sample",
  parseServerURL: `url/parse`,
  serverURL: `url`,
  port: PORT,
  parseDashboardAdmin: { user: "admin", pass: "sample" },
};
module.exports = config;
```