const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "please provide a username"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
      trim: true,
      minlength: 2,
      // maxLength: 20,
    },
    email: {
      type: String,
      required: [true, "please provide a email"],
      trim: true,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    activated: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
