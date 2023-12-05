require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const db = require("./models");

const PORT = 4545;

const authRoute = require("./routes/authentication");
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const categories = require("./routes/categories");
const comments = require("./routes/comments");

const verifyJWTMid = require("./middleware/verify-jwt");

const staticFilesDirectory = path.join(__dirname, "upload");
app.use(express.static(staticFilesDirectory));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });
//app.use(cors({ origin: "http://localhost:3000", credentials: true }));

var whitelist = [
  "http://localhost:*",
  "http://localhost:4545",
  "http://192.168.0.100:3000", // Replace with the actual IP addresses of your local network
  "http://192.168.0.101:3000",
  "http://192.168.0.102:3000" /** other domains if any */,
];
var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    console.log("ORIGIN: ", origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      //callback(new Error("Not allowed by CORS"));
      callback(null, true);
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth/", authRoute);
app.use("/api/users/", usersRoute);
app.use("/api/posts/", postsRoute);
app.use("/api/categories", categories);
app.use("/api/comments", comments);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

db.sequelize.sync().then((req) => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
