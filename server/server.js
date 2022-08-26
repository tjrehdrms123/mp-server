const express = require("express");
require("dotenv").config();
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

const s3Adapter = new S3Adapter(
  process.env.S3ACCESSKEY,
  process.env.S3SECERTKEY,
  process.env.S3BUCKET,
  {
    region: process.env.S3REGION,
    bucketPrefix: "",
    directAccess: true,
    baseUrl: process.env.S3BASEURL,
    signatureVersion: process.env.S3SIGNATUREVERSION,
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
  publicServerURL: process.env.PARSESERVERURL,
  // filesAdapter: fsAdapter,
  filesAdapter: s3Adapter,
  databaseURI: process.env.DATABASEURI,
  appId: process.env.PARSEAPPID,
  masterKey: process.env.PARSEMASTERKEY,
  clientKey: process.env.PARSECLIENTKEY,
  restAPIKey: process.env.PARSERESTAPIKEY,
  javascriptKey: process.env.PARSEJAVASCRIPTKEY,
  port: process.env.port,
});

const ParseDashboard = require("parse-dashboard");
const dashboard = new ParseDashboard(
  {
    // 배열로 해야 함.
    apps: [
      {
        appId: process.env.PARSEAPPID,
        appName: process.env.PARSEAPPNAME,
        serverURL: process.env.PARSESERVERURL,
        masterKey: process.env.PARSEMASTERKEY,
        javascriptKey: process.env.PARSEJAVASCRIPTKEY,
      },
    ],
    users: [{ user: process.env.PARSEADMINID, pass: process.env.PARSEADMINPW }],
  },
  { allowInsecureHTTP: true }
);

// Route
app.use("/parse", parseServer.app);
app.use("/dashboard", dashboard);

app.use(
  session({
    httpOnly: true, //자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    secure: false, //https 환경에서만 session 정보를 주고받도록처리
    secret: "MP secret key", //암호화하는 데 쓰일 키
    resave: false, //세션을 언제나 저장할지 설정함
    saveUninitialized: true, //세션이 저장되기 전 uninitialized 상태로 미리 만들어 저장
    cookie: {
      //세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
      httpOnly: false,
      Secure: true,
    },
  })
);

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

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
