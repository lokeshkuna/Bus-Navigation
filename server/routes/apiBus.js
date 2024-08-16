import { Router } from "express";
import { BusModel } from "../models/BusModel.js";

const busesData = [];

(async function fetchBuses() {
  try {
    // Find all buses in the database
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

const router = Router();
// Route to send buses data as JSON
router.get("/api/busesdata", (req, res) => {
  res.json(busesData);
  // console.log(busesData[0]);
});

export default router;
