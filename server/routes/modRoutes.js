import { Router, application } from "express";
import {
  logout_get_mod,
  mod_login,
  mod_post,
} from "../controllers/moderatorController.js";
import { moderatorModel } from "../models/moderatorModel.js";
import { UserModel } from "../models/User.js";
import { adminModel } from "../models/adminModel.js";
import { BusModel } from "../models/BusModel.js";
import methodOverride from "method-override";
import bcrypt from "bcrypt";
import { requireAuthAdmin } from "../../middleware/adminMiddleware.js";
import session from "express-session";
import { requireAuthMod } from "../../middleware/modMiddleware.js";
const router = Router();

// router.use(methodOverride("_method"));

router.use(
  session({
    // key: "admin_id",
    secret: "mod-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 100000,
      createdAt: Date.now(),
    },
  })
);

router.use((req, res, next) => {
  // Check if session exists and if createdAt timestamp is already set
  if (req.session && !req.session.createdAt) {
    req.session.createdAt = Date.now();
  }
  next();
});

router.get("/mod/time", (req, res) => {
  // Check if session exists and createdAt timestamp is set
  if (req.session && req.session.createdAt) {
    // Calculate time elapsed in minutes
    const currentTime = Date.now();
    const sessionStartTime = req.session.createdAt;
    const elapsedTimeInMinutes = Math.floor(
      (currentTime - sessionStartTime) / 1000
    );

    // Send the elapsed time in minutes as JSON response
    res.json({ timeLoggedIn: elapsedTimeInMinutes });
  } else {
    // If session doesn't exist or session start time is not set, send an error response
    res
      .status(400)
      .json({ error: "Session not found or session start time not set" });
  }
});

const userData = [];
const adminData = [];
const moderatorData = [];
const busesData = [];

(async function fetchBuses() {
  try {
    // Find all buses in the database
    const usersDD = await UserModel.find({});

    usersDD.forEach((user) => {
      userData.push({
        id: user._id,
        email: user.email,
        password: user.password,
        role: user.role,
      });
    });

    const adminsDD = await adminModel.find({});

    adminsDD.forEach((admin) => {
      adminData.push({
        id: admin._id,
        username: admin.username,
        password: admin.password,
        role: admin.role,
        createdAt: admin.createdAt.toLocaleString(),
      });
    });

    const modDD = await moderatorModel.find({});

    modDD.forEach((mod) => {
      moderatorData.push({
        id: mod._id,
        username: mod.username,
        password: mod.password,
        role: mod.role,
        createdAt: mod.createdAt.toLocaleString(),
      });
    });

    const buses = await BusModel.find({});

    buses.forEach((bus) => {
      busesData.push({
        busId: bus._id,
        name: bus.name,
        route: bus.route,
        timings: bus.timings,
        reviews: bus.reviews,
        rating: bus.rating,
      });
    });

    // console.log(busesData);
  } catch (err) {
    console.error("Error fetching buses:", err);
  }
})();

router.get("/mod", (req, res) => {
  res.render("moderator");
});

router.get("/mod/dashboard", requireAuthMod, (req, res) => {
  res.render("modDashboard", {
    adminData: adminData,
    moderatorData: moderatorData,
    userData: userData,
    currentMod: moderatorData,
    buses: busesData,
  });
  console.log(moderatorData);
});

router.post("/mod", mod_login);

router.get("/create/mod", (req, res) => {
  res.render("createMod");
});
router.post("/create/mod", mod_post);

router.get("/delete/mod/:id", async (req, res) => {
  const modId = req.params.id;
  const gotMod = await moderatorModel.find({ _id: modId });
  res.render("deleteMod", { Moderator: gotMod });
});

router.post("/confirm/delete/:id", requireAuthAdmin, async (req, res) => {
  const modId = req.params.id;
  try {
    const deletedMod = await moderatorModel.findByIdAndDelete(modId);
    if (!deletedMod) {
      return res.status(404).send("Moderator not found");
    }
    console.log(`${deletedMod} is deleted successfully`);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting moderator:", error);
    res.status(500).send("Error deleting moderator");
  }
});

router.get("/update/moderator/:id", requireAuthAdmin, async (req, res) => {
  const modId = req.params.id;
  const gotMod = await moderatorModel.find({ _id: modId });
  // console.log(gotMod);
  res.render("editMod", { moderator: gotMod });
});

router.post("/update/moderator/:id", requireAuthAdmin, async (req, res) => {
  const modId = req.params.id;
  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedMod = await moderatorModel.findByIdAndUpdate(
      modId,
      { username, password: hashedPassword },
      { new: true }
    );
    console.log(
      "moderator updated successfully: username - " +
        username +
        " password - " +
        password
    );
    res.redirect("/mod");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/logout/mod", logout_get_mod);

export default router;
