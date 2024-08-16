import { Router } from "express";
import { BusModel } from "../models/BusModel.js";

const router = Router();
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
        mapLink: bus.mapLink,
      });
    });

    // console.log(busesData);
  } catch (err) {
    console.error("Error fetching buses:", err);
  }
})();

// Route to fetch buses data
router.get("/home", async (req, res) => {
  // res.sendFile("home.html", { root: "C:\\IIIT\\FSD\\files\\public" });

  res.render("home", { busesArray: busesData });
});

router.get("/home2", (req, res) => {
  res.render("home2", { busesArray: busesData });
});

router.get("/api/bus/:busId", async (req, res) => {
  const busId = req.params.busId;

  try {
    // Find the bus with the given ID
    const bus = await BusModel.findOne({ _id: busId });

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Convert the bus object to a plain JavaScript object
    const busData = bus.toObject();

    // Send the bus data as JSON response
    res.json(busData);
  } catch (error) {
    console.error("Error fetching bus data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
export { busesData };
