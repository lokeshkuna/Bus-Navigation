import express from "express";

const router = express.Router();

router.use(express.static("public"));

router.get("/", (req, res) => {
  res.sendFile("signin_signup.html", { root: "D:\\IIIT\\final\\public" });
});

router.get("/signup-login", (req, res) => {
  // Send HTML content directly
  // res.send("<h1>Hello</h1>");

  // Send the file using res.sendFile()
  res.sendFile("signin_signup.html", { root: "D:\\IIIT\\final\\public" });
});

// router.post("/signup", (req, res) => {
//   const { email, password } = req.body;
//   const user = new UserModel({ email, password });
//   user.save();
// });

export default router;
