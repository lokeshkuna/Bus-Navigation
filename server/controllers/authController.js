import { UserModel } from "../models/User.js";
import { authLogin } from "../models/User.js";
import jwt from "jsonwebtoken";

const handleErrors = (err) => {
  console.log(err.message, err.code);

  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = "That email is already registered.";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors),
      forEach(({ properties }) => {
        errors[properties.path] = properties.message;
        console.log(properties);
      });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "net ninja secret", {
    expiresIn: maxAge, // it accepts in seconds;
  });
};

const signup_get = (req, res) => {
  res.render("signup");
};

const login_get = (req, res) => {
  res.render("login");
};

const signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    // const user = await User.create({ email, password });
    // const token = createToken(user._id);
    // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    // res.status(201).json({ user: user._id });
    const user = new UserModel({ email, password });
    await user.save();
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    console.log(`Cookies created and sent ${res.cookie.jwt}`);
    console.log(`User signup successful, ${email} ${password}`);
    res.redirect("/");
    // res.sendStatus(201);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authLogin(email, password);
    console.log(` User :  \n ${user} has logged in`);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200);
    res.redirect("/home2");
  } catch (error) {
    res.status(400).json({});
    const err = handleErrors(error);
    console.log(err);
  }
};

const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/home2");
};

export { signup_get, login_get, signup_post, login_post, handleErrors };
