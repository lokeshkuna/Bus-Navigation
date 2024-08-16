import { authLoginModerator } from "../models/moderatorModel.js";
import { moderatorModel } from "../models/moderatorModel.js";
import { handleErrors } from "./authController.js";
import jwt from "jsonwebtoken";

const mod_post = async (req, res) => {
  try {
    const { username, password } = req.body;
    const modUser = new moderatorModel({ username, password });
    await modUser.save();
    console.log("moderator created succesfully ", modUser);
    res.redirect("/mod");
  } catch (error) {
    console.log(error);
  }
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "mod surya secret", {
    expiresIn: maxAge, // it accepts in seconds;
  });
};

const mod_login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const mod = await authLoginModerator(username, password);
    console.log(` Moderator :  \n ${mod} has logged in`);
    const token = createToken(mod._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    // res.status(200);
    res.redirect("/mod/dashboard");
  } catch (error) {
    res.status(400).json({});
    const err = handleErrors(error);
    console.log(error);
  }
};

const logout_get_mod = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.cookie("connect.sid", "", { maxAge: 1 });
  res.redirect("/mod");
};

export { mod_post, mod_login, logout_get_mod };
