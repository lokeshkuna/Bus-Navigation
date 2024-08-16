import jwt from "jsonwebtoken";
import { adminModel } from "../server/models/adminModel.js";

const requireAuthAdmin = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token); // token to console

    if (token) {
      jwt.verify(token, "admin surya secret", (error, decodedToken) => {
        if (error) {
          console.log(error.message);
          res.redirect("/admin");
        } else {
          console.log("Decoded token : ");
          console.log(decodedToken);
          console.log("session : ");
          console.log(req.session); //  decoded toke to console
          next();
        }
      });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error.message);
    console.log("admin is not logged in.");
    res.redirect("/admin");
  }
};

const authAdminSession = (req, res, next) => {
  try {
    if (req.sessions.admin_id) {
      next();
    } else {
      console.log("Admin has no session logged in");
      if (req.cookies.jwt) {
        res.cookie("jwt", "", { maxAge: 400 });
        console.log("cookie removed");
      }
      res.redirect("/admin");
    }
    next();
  } catch (error) {}
};

// Check current user
const checkAdmin = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "net ninja secret", async (error, decodedToken) => {
      if (error) {
        console.log(error);
        // res.redirect("/home");
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await adminModel.findById(decodedToken.id);
        res.locals.user = user;
        // accessed by the views
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const checkSession = (admin) => (req, res, next) => {
  if (req.session && req.session.admin_id) {
    // Check if the session's admin_id matches the admin_id stored in the session
    if (req.session.admin_id === admin._id) {
      next();
    } else {
      res.redirect("/admin");
    }
  } else {
    res.redirect("/admin");
  }
};

export { requireAuthAdmin, authAdminSession, checkSession };
