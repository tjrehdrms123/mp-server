const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
// morgan: 로그 패키지
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { default: ParseServer, ParseGraphQLServer } = require("parse-server");
var FSFilesAdapter = require("@parse/fs-files-adapter");
var fsAdapter = new FSFilesAdapter();
var S3Adapter = require("@parse/s3-files-adapter");
const { swaggerUi, specs } = require("./swagger_modules/swagger");
const session = require("express-session");

const app = express();

app.use(express.static('public'));
app.use('/memo', express.static(__dirname + '/public/memo.html'));
app.use('/memo/write', express.static(__dirname + '/public/memoWrite.html'));
app.use('/memo/signup', express.static(__dirname + '/public/signup.html'));
app.use('/memo/email', express.static(__dirname + '/public/email.html'));
app.use('/memo/login', express.static(__dirname + '/public/login.html'));

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
app.use(cookieParser());

// const s3Adapter = new S3Adapter(
//   process.env.S3ACCESSKEY,
//   process.env.S3SECERTKEY,
//   process.env.S3BUCKET,
//   {
//     region: process.env.S3REGION,
//     bucketPrefix: "",
//     directAccess: true,
//     baseUrl: process.env.S3BASEURL,
//     signatureVersion: process.env.S3SIGNATUREVERSION,
//     globalCacheControl: "public, max-age=86400", // 24 hrs Cache-Control.
//     validateFilename: (filename) => {
//       if (filename.length > 1024) {
//         return "Filename too long.";
//       }
//       return null; // Return null on success
//     },
//     generateKey: (filename) => {
//       return filename; // unique prefix for every filename
//     },
//   }
// );

const parseServer = new ParseServer({
  publicServerURL: process.env.PARSESERVERURL,
  filesAdapter: fsAdapter,
  //filesAdapter: s3Adapter,
  databaseURI: process.env.DATABASEURI,
  appId: process.env.PARSEAPPID,
  masterKey: process.env.PARSEMASTERKEY,
  clientKey: process.env.PARSECLIENTKEY,
  restAPIKey: process.env.PARSERESTAPIKEY,
  javascriptKey: process.env.PARSEJAVASCRIPTKEY,
  port: process.env.port,
});

const ParseDashboard = require("parse-dashboard");
const passport = require("passport");
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

app.use("/", routes);
app.get("/", (req, res) => {
  return res.send("Welcome to MP Server");
});

app.use((req, res) => {
  return res.status(404).send({ content: "API를 확인해주세요." });
});

// 응답 미들웨어
app.use((result, req, res, next) => {
  console.log(result);
  if (result?.data?.type === "cookie") {
    return res.status(200).cookie("refreshToken", result.data.refreshToken).cookie("accessToken", result.data.accessToken).send(result);
  } else if (result.status === 200) {
    return res.status(200).send(result);
  }
  if (result.status === 400 && 500) {
    return res.status(200).send(result);
  } else {
    return res.send(result);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`server is running ${process.env.PORT}`);
});
