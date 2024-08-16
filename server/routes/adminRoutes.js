import { Router } from "express";
import {
  admin_login,
  admin_post,
  logout_get_admin,
} from "../controllers/adminController.js";
import { UserModel } from "../models/User.js";
import { adminModel } from "../models/adminModel.js";
import { moderatorModel } from "../models/moderatorModel.js";
import { BusModel } from "../models/BusModel.js";
import { requireAuthAdmin } from "../../middleware/adminMiddleware.js";
import session from "express-session";
import bcrypt from "bcrypt";

const router = Router();

router.use(
  session({
    // key: "admin_id",
    secret: "admin-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 100000,
      createdAt: Date.now(),
    },
  })
);

router.get("/admin", (req, res) => {
  res.render("admin");
});

router.use((req, res, next) => {
  // Check if session exists and if createdAt timestamp is already set
  if (req.session && !req.session.createdAt) {
    req.session.createdAt = Date.now();
  }
  next();
});

router.get("/admin/time", (req, res) => {
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

router.get("/edit/admin/:id", requireAuthAdmin, async (req, res) => {
  const adminId = req.params.id;
  const admin = await adminModel.find({ _id: adminId });
  res.render("editAdmin", { admin });
});

router.post("/edit/admin/:id", async (req, res) => {
  const { username, password } = req.body;
  const adminId = req.params.id;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // Find and update the admin by ID
    const updatedAdmin = await adminModel.findByIdAndUpdate(
      adminId,
      { username, password: hashedPassword },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).send("Admin not found");
    }

    // Redirect to a success page or send a success message
    res.redirect("/admin/dashboard"); // Redirect to admin dashboard after successful update
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).send("Error updating admin");
  }
});

router.post("/admin", admin_login);

router.get("/create/admin",requireAuthAdmin, (req, res) => {
  res.render("createAdmin");
});

router.get("/logout/admin", logout_get_admin);

router.post("/create/admin", requireAuthAdmin, admin_post);

const userData = [];
const adminData = [];
const moderatorData = [];
const busesData = [];

(async function fetchData() {
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

router.get("/admin/dashboard", requireAuthAdmin, (req, res) => {
  res.render("adminDashboard", {
    adminData: adminData,
    moderatorData: moderatorData,
    userData: userData,
    currentAdmin: adminData[0],
    buses: busesData,
  });
  // console.log(moderatorData);
});

export default router;
