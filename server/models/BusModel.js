import mongoose from "mongoose";
const busSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  route: {
    type: String,
  },
  timings: {
    type: String,
  },
  reviews: [
    {
      rating: {
        type: Number,
      },
      review: {
        type: String,
      },
    },
  ],
  rating: {
    // overall rating based on users
    type: String,
  },
  mapLink: {
    type: String,
  },
});

const BusModel = mongoose.model("DataBuse", busSchema);

export { BusModel };
