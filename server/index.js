import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/connect.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.static("public"));
const database_url =
  process.env.mongo_url ||
  "mongodb+srv://captain-marvel:L8K6IMUzDlQZw4pC@mern-project-1.qyj0fdm.mongodb.net/Bus-M";
const PORT = process.env.PORT || 3000;

// middleware
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// view engine
app.set("view engine", "ejs");
app.use(express.static("views"));

connectDB(database_url);

app.use(routes);

app.get("/", (req, res) => {
  res.status(201).send("<h1>Hello</h1>");
});

app.get("/", (req, res) => {
  // Send HTML content directly
  // res.send("<h1>Hello</h1>");

  // Send the file using res.sendFile()
  res.sendFile("signin_signup.html", { root: "C:\\IIIT\\FSD\\BUS-M\\public" });
});

app.listen(PORT, () =>
  console.log(`server started on port http://localhost:${PORT}`)
);

/* */
app.get("/set-cookie", (req, res) => {
  // res.setHeader("Set Cookie", "newUser = true");
  res.cookie("newUser", "false");
  // key = value;
  res.cookie("'isEmployee", "true", {
    maxAge: 1000 * 60 * 60 * 24,
    // secure: true,
    httpOnly: true,
  });
  res.send("You got the cookie");
});
