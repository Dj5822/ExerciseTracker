import mongoose from "mongoose";

/*
Create user model.
*/
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

/*
  Create exercise model.
  */
const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: Date,
});

export const User = mongoose.model("User", userSchema);
export const Exercise = mongoose.model("Exercise", exerciseSchema);
