import { Router } from "express";
import {
  signup_get,
  signup_post,
  login_get,
  login_post,
} from "../controllers/authController.js";
import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";
import { requireAuthAdmin } from "../../middleware/adminMiddleware.js";

const router = Router();

// router.get("/signup", signup_get);
// router.get("/login", login_get);
router.post("/signup", signup_post);
router.post("/login", login_post);
// router.get('logout', authController.logout_get);

router.get("/update/user/:id", async (req, res) => {
  const userId = req.params.id;
  const gotUser = await UserModel.find({ _id: userId });
  console.log(gotUser[0].email);
  res.render("editUser", { user: gotUser });
});

router.post("/update/user/:id", async (req, res) => {
  const userId = req.params.id;
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { email, password: hashedPassword },
      { new: true }
    );
    console.log(
      "user updates successfully : username - " +
        email +
        " password - " +
        password
    );
    res.redirect("/signup-login");
  } catch (error) {
    console.log(error);
  }
});

router.get("/create/user", (req, res) => {
  res.render("createUser");
});

router.get("/delete/user/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await UserModel.find({ _id: userId });
  res.render("deleteUser", { user });
});

router.post("/confirm/delete/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    console.log(`${deletedUser} is deleted successfully`);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error deleting moderator:", error);
    res.status(500).send("Error deleting moderator");
  }
});

router.post("/create/user", signup_post);

export default router;
