import jwt from "jsonwebtoken";
import { adminModel } from "../models/adminModel.js";
import { handleErrors } from "./authController.js";
import { authLoginAdmin } from "../models/adminModel.js";

const admin_post = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = new adminModel({ username, password });
    await admin.save();
    console.log("admin created succesfully ", admin);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "admin surya secret", {
    expiresIn: maxAge, // it accepts in seconds;
  });
};

const admin_login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const admin = await authLoginAdmin(username, password);
    console.log(` Admin :  \n ${admin} has logged in`);
    const token = createToken(admin._id);
    req.session.admin_id = admin._id;
    res.cookie("jwt", token, { maxAge: maxAge * 1000 });
    res.status(200);
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(400).json({});
    const err = handleErrors(error);
    console.log(error);
  }
};

const logout_get_admin = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.cookie("connect.sid", "", { maxAge: 1 });
  res.redirect("/admin");
};

export { admin_post, admin_login, logout_get_admin };
