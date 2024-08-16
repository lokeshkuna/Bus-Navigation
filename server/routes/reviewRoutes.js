import { Router } from "express";
import { reviewModel } from "../models/reviewModel.js";
import { BusModel } from "../models/BusModel.js";
import { suggestionModel } from "../models/suggestionModel.js";

const router = Router();

// router.get("/review", (req, res) => {
//   res.render("review");
// });

router.get("/review", async (req, res) => {
  try {
    const reviews = await reviewModel.find({});
    res.render("review", { reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/review/submit", async (req, res) => {
  const { name, rating, comment } = req.body;
  const newReview = new reviewModel({ name, rating, comment });
  try {
    await newReview.save();
    res.redirect("/review");
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Route for submitting suggestions
router.post("/submitSuggestion", async (req, res) => {
  const { email, suggestion } = req.body;
  const newSuggestion = new suggestionModel({ email, suggestion });
  try {
    await newSuggestion.save();
    res.redirect("/review");
  } catch (err) {
    console.error("Error saving suggestion:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/faq", (req, res) => {
  res.sendFile("faq.html", { root: "D:\\IIIT\\final\\public" });
});

router.get("/about_us", (req, res) => {
  res.sendFile("About_us.html", { root: "D:\\IIIT\\final\\public" });
});

export default router;
