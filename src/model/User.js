import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "please provide a username"],
      trim: true,
      unique: true, // Ensure email is unique
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
      unique: true, // Ensure email is unique
      lowercase: true, // Store email addresses in lowercase for consistency
    },
    activated: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
