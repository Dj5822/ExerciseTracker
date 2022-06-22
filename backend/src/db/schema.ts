import mongoose from "mongoose";

export interface IUser {
  username: string
}

export interface IExercise {
  userId: string,
  name: string,
  quantity: number,
  date: Date,
}

/*
User
username - the identifier for the user.
*/
const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
});

/*
Exercise
userId - the userId of the user that did the exercise.
name - the name of the exercise.
quantity - the amount of the exercise that was done.
date - the date the exercise was done.
*/
const exerciseSchema = new mongoose.Schema<IExercise>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, required: true},
});

export const User = mongoose.model("User", userSchema);
export const Exercise = mongoose.model("Exercise", exerciseSchema);
