const express = require("express");
const config = require("./config");
const cors = require("cors");
const morgan = require("morgan");
//const routes = require("./routes");
const bodyParser = require("body-parser");
const { default: ParseServer, ParseGraphQLServer } = require("parse-server");
var FSFilesAdapter = require("@parse/fs-files-adapter");
var fsAdapter = new FSFilesAdapter();
var S3Adapter = require("@parse/s3-files-adapter");
// const { swaggerUi, specs } = require("./swagger_modules/swagger");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json({ limit: "50mb" }));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(
  morgan(":method :url | :status | :response-time ms | :date[iso] | ", {
    skip: (req, res) => {
      return req.originalUrl.startsWith("/parse");
    },
  })
);
// app.use(morgan(':method :url | :status | :response-time ms | :date[iso] | '));

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
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

//app.use("/", routes);
app.get("/", (req, res) => {
  return res.send("Welcome to MB Server");
});

app.use((req, res) => {
  return res.status(404).send({ message: "API를 확인해주세요." });
});

app.listen(config.port, () => {
  console.log("server is running");
});
