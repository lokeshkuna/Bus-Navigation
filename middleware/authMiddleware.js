import jwt from "jsonwebtoken";
import { UserModel } from "../server/models/User";

const requireAuth = (req, res, next) => {
  const token = req.cookie.jwt;

  if (token) {
    jwt.verify(token, "net ninja secret", (error, decodedToken) => {
      if (error) {
        console.log(error);
        res.redirect("/home");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/home");
  }
};

// Check current user
const checkUser = (req, res, next) => {
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
        let user = await UserModel.findById(decodedToken.id);
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

export { requireAuth };
