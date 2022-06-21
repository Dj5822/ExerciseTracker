import mongoose from "mongoose";

/*
User
username - the identifier for the user.
*/
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

/*
Exercise
userId - the userId of the user that did the exercise.
name - the name of the exercise.
quantity - the amount of the exercise that was done.
date - the date the exercise was done.
*/
const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, required: true},
});

export const User = mongoose.model("User", userSchema);
export const Exercise = mongoose.model("Exercise", exerciseSchema);
