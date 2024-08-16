import mongoose from "mongoose";
import pkg from "validator";
import bcrypt from "bcrypt";
const { isEmail } = pkg;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
    maxlength: [16, "Password must not exceed 16 characters"],
  },
  role: {
    type: String,
    enum: ["admin", "moderator", "user"],
    default: "user",
  },
});

/* // Before saving the user, hash the password
UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  // Here you would hash the password, for example using bcrypt
  // For simplicity, we'll just log a message
  console.log("Password should be hashed here");
  next();
}); */

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt); // two parameters
  next();
});

// fire a function doc saved to db
// here post is meant by AFTER something
UserSchema.post("save", (doc, next) => {
  console.log("new user was created & saved", doc);
  next();
});

const UserModel = mongoose.model("User", UserSchema);

// static method to login user
const authLogin = async (email, password) => {
  const user = await UserModel.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw Error("Incorrect Password");
    }
  } else {
    throw Error("Incorrect email");
  }
};

export { UserModel, authLogin };
