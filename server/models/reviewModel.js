import mongoose from "mongoose";
const date = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}); // Adjusting to Indian time

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: () => {
      // Get current Indian Standard Time (IST)
      const ISTOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds
      const now = new Date();
      const ISTTime = new Date(now.getTime() + ISTOffset);
      return ISTTime;
    }
  }
});

const reviewModel = mongoose.model('WebReview', reviewSchema);

export  {reviewModel};