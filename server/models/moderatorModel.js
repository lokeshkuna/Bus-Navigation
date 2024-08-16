import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the moderator schema
const moderatorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "moderator", "user"],
    default: "moderator", // Set the default role to "moderator"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Pre-save hook to hash the password before saving
moderatorSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create a model for the moderator schema
const moderatorModel = mongoose.model("Moderator", moderatorSchema);

// Authentication function for logging in moderators
const authLoginModerator = async (username, password) => {
  const moderator = await moderatorModel.findOne({ username: username });
  if (moderator) {
    const auth = await bcrypt.compare(password, moderator.password);
    if (auth) {
      return moderator;
    } else {
      throw Error("Incorrect Password");
    }
  } else {
    throw Error("Incorrect moderator Username");
  }
};

export { moderatorModel, authLoginModerator };
