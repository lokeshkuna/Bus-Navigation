import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the admin schema
const adminSchema = new mongoose.Schema({
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
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

adminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt); // two parameters
  next();
});
const adminModel = mongoose.model("Admin", adminSchema);

const authLoginAdmin = async (username, password) => {
  const admin = await adminModel.findOne({ username: username });
  if (admin) {
    const auth = await bcrypt.compare(password, admin.password);
    if (auth) {
      return admin;
    } else {
      throw Error("Incorrect Password");
    }
  } else {
    throw Error("Incorrect admin username");
  }
};

export { adminModel, authLoginAdmin };
