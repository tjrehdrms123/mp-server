const express = require("express");
const config = require("./config");
const { passports } = require("./config");
const cors = require("cors");
const morgan = require("morgan");
// morgan: 로그 패키지
const routes = require("./routes");
const bodyParser = require("body-parser");
const { default: ParseServer, ParseGraphQLServer } = require("parse-server");
var FSFilesAdapter = require("@parse/fs-files-adapter");
var fsAdapter = new FSFilesAdapter();
var S3Adapter = require("@parse/s3-files-adapter");
const { swaggerUi, specs } = require("./swagger_modules/swagger");
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const session = require("express-session");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(
  morgan(":method :url | :status | :response-time ms | :date[iso] | ", {
    skip: (req, res) => {
      return req.originalUrl.startsWith("/parse");
    },
  })
);
app.use(morgan(":method :url | :status | :response-time ms | :date[iso] | "));

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  session({
    httpOnly: true, //자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    secure: true, //https 환경에서만 session 정보를 주고받도록처리
    secret: "secret key", //암호화하는 데 쓰일 키
    resave: false, //세션을 언제나 저장할지 설정함
    saveUninitialized: true, //세션이 저장되기 전 uninitialized 상태로 미리 만들어 저장
    cookie: {
      //세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
      httpOnly: true,
      Secure: true,
    },
  })
);

const s3Adapter = new S3Adapter(
  config.S3accessKey,
  config.S3secretKey,
  config.S3bucket,
  {
    region: config.S3region,
    bucketPrefix: "",
    directAccess: true,
    baseUrl: config.S3baseUrl,
    signatureVersion: config.S3signatureVersion,
    globalCacheControl: "public, max-age=86400", // 24 hrs Cache-Control.
    validateFilename: (filename) => {
      if (filename.length > 1024) {
        return "Filename too long.";
      }
      return null; // Return null on success
    },
    generateKey: (filename) => {
      return filename; // unique prefix for every filename
    },
  }
);

const parseServer = new ParseServer({
  publicServerURL: config.parseServerURL,
  // filesAdapter: fsAdapter,
  filesAdapter: s3Adapter,
  databaseURI: config.databaseURI,
  appId: config.parseAppId,
  masterKey: config.parseMasterKey,
  clientKey: config.parseClientKey,
  restAPIKey: config.parseRestAPIKey,
  javascriptKey: config.parseJavascriptKey,
  port: config.port,
});

const ParseDashboard = require("parse-dashboard");
const dashboard = new ParseDashboard(
  {
    // 배열로 해야 함.
    apps: [
      {
        appId: config.parseAppId,
        appName: config.parseAppName,
        serverURL: config.parseServerURL,
        masterKey: config.parseMasterKey,
        javascriptKey: config.parseJavascriptKey,
      },
    ],
    users: [config.parseDashboardAdmin],
  },
  { allowInsecureHTTP: true }
);

// Route
app.use("/parse", parseServer.app);
app.use("/dashboard", dashboard);

app.use("/", routes);
app.get("/", (req, res) => {
  return res.send("Welcome to MP Server");
});

app.use((req, res) => {
  return res.status(404).send({ content: "API를 확인해주세요." });
});

// 응답 미들웨어
app.use((result, req, res, next) => {
  if (result[0]?.data?.type === "cookie") {
    // [loginSuccess, loginToken]
    res.status(200).cookie("refreshToken", result[1]).send(result[0]);
  } else if (result.status === 200) {
    res.status(200).send(result);
  }
  if (result.status === 400 && 500) {
    res.status(200).send(result);
  }
});

app.listen(config.port, () => {
  console.log("server is running");
});
