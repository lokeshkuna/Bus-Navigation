import { Router } from "express";
import { BusModel } from "../models/BusModel.js";
import { requireAuthAdmin } from "../../middleware/adminMiddleware.js";

const router = Router();

router.get("/busInfo/:id", async (req, res) => {
  try {
    // Fetch bus data from MongoDB based on the provided ID
    const busId = req.params.id;
    console.log(busId);
    const busData = await BusModel.findOne({ _id: busId });
    console.log(busData);

    // Render the EJS template and pass the busData
    res.render("businfo", { bus: busData });
  } catch (error) {
    console.error("Error fetching bus data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/update/bus/:id", async (req, res) => {
  const busId = req.params.id;
  const gotBus = await BusModel.findOne({ _id: busId });
  res.render("updateBus", { bus: gotBus });
});

router.post("/update/bus/:id", requireAuthAdmin, async (req, res) => {
  const busId = req.params.id;
  const { name, route, timings, reviews, rating } = req.body;

  try {
    // Find the bus by ID and update its fields
    const updatedBus = await BusModel.findByIdAndUpdate(
      busId,
      { name, route, timings, reviews, rating },
      { new: true }
    );

    // Check if the bus was found and updated successfully
    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    console.log("bus updated successfully : " + updatedBus);

    res.redirect("/api/busesdata");

    // Send a success response with the updated bus data
    // res
    //   .status(200)
    //   .json({ message: "Bus updated successfully", bus: updatedBus });
  } catch (error) {
    // Handle any errors and send a response with an error message
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.get("/add/bus", (req, res) => {
  res.render("addBus");
});

router.post("/add/bus", async (req, res) => {
  const { name, route, timings, rating, mapLink, reviews } = req.body;

  try {
    // Convert rating to a number
    const parsedRating = parseFloat(rating);

    // Create a new bus document
    const newBus = new BusModel({
      name,
      route,
      timings,
      rating: parsedRating,
      mapLink,
    });

    // Save the new bus document to the database
    const savedBus = await newBus.save();

    // Redirect to a success page or send a success message
    res.redirect("/mod/dashboard"); // Redirect to admin dashboard after successful addition
  } catch (error) {
    console.error("Error adding bus:", error);
    res.status(500).send("Error adding bus");
  }
});

router.get("/add/reviews/:id", async (req, res) => {
  const busId = req.params.id;
  const bus = await BusModel.find({ _id: busId });
  res.render("addBusReview", { bus: bus });
});

router.post("/add/reviews/:id", async (req, res) => {
  const busId = req.params.id;
  const { reviews, ratings } = req.body;

  try {
    // Create an array to store review objects
    const reviewObjects = [];

    // Iterate through reviews and ratings arrays to create review objects
    // for (let i = 0; i < reviews.length; i++) {
    //   const reviewObj = {
    //     review: reviews[i],
    //     rating: parseFloat(ratings[i]),
    //   };
    //   reviewObjects.push(reviewObj);
    // }

    const reviewObj = {
      review: reviews,
      rating: parseFloat(ratings),
    };

    reviewObjects.push(reviewObj);

    // Update the bus document with the new reviews
    const updatedBus = await BusModel.findByIdAndUpdate(
      busId,
      { $push: { reviews: { $each: reviewObjects } } },
      { new: true }
    );

    if (!updatedBus) {
      return res.status(404).send("Bus not found");
    }

    // Redirect to a success page or send a success message
    res.redirect(`/busInfo/${busId}`); // Redirect to admin dashboard after successful addition of reviews
  } catch (error) {
    console.error("Error adding reviews:", error);
    res.status(500).send("Error adding reviews");
  }
});


// (async function deletbus(){
//   const id = "66328fc2a96d3cfc1fb999e7";
// await BusModel.deleteOne({_id : id});
// })()

export default router;
