import jwt from "jsonwebtoken";
import { moderatorModel } from "../server/models/moderatorModel.js";

const requireAuthMod = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token); // token to console

    if (token) {
      jwt.verify(token, "mod surya secret", (error, decodedToken) => {
        if (error) {
          console.log(error.message);
          res.redirect("/mod");
        } else {
          console.log("Decoded token : ");
          console.log(decodedToken);
          console.log("session : ");
          console.log(req.session); //  decoded toke to console
          next();
        }
      });
    } else {
      res.redirect("/mod");
    }
  } catch (error) {
    console.log(error.message);
    console.log("moderator is not logged in.");
    res.redirect("/mod");
  }
};

export { requireAuthMod };
