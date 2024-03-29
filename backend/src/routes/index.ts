import express from "express";
import { User, Exercise } from "../db/schema";
import getExerciseDTO from "../dto/exerciseDTO";
import getLogsDTO from "../dto/logsDTO";
import getStatsDTO from "../dto/statsDTO";
import getUserDTO from "../dto/userDTO";
import checkJwt from "../middleware/checkJwt";
import { getExerciseStats, getCumulativeExerciseStats } from "../services/getExerciseStats";

const router = express.Router();

/*
Used to create a new user.
*/
router.post("/users", async (req, res) => {
  const username = req.body.username;
  let user;

  // Check if the username is missing.
  if (!username) {
    res.status(404).send("Missing the username field in the request body.");
    return;
  }

  // Add the new user to the database.
  try {
    user = new User({ username: username });
    user.save();
  } catch (err) {
    res.status(500).json({ error: err });
    return;
  }  

  // Send response.
  res.status(201).json(getUserDTO(user));
});

/*
Used to get a list of all the users.
*/
router.get("/users", async (req, res) => {
  const users = await User.find({});

  if (users) {
    res.status(200).send(users);
  } else {
    res.status(404).send("Could not find users.");
  }
});

/*
Used to post a new exercise.
*/
router.post("/users/:_id/exercises", async (req, res) => {
  let user;
  let exercise;

  // Check whether user exists.
  try {
    user = await User.findById({ _id: req.params._id });
    if (!user) throw new Error("No user found.");
  } catch (err) {
    res.status(404).json({ error: "You need to supply a valid user id." });
    return;
  }

  // Check whether parameters are not empty.
  if (!req.body.name || !req.body.quantity) {
    res.status(400).json({error: "You need to supply the name and quantity of the exercise."});
    return;
  }

  // Add new exercise to the database.
  try {
    exercise = new Exercise({
      userId: user._id,
      name: req.body.name,
      quantity: req.body.quantity,
      date: req.body.date ? new Date(Date.parse(req.body.date)) : new Date(),
    });
    await exercise.save();
  }
  catch(err) {
    res.status(500).send("Internal server error.");
    return;
  }

  // Send response.
  res.status(201).json(getExerciseDTO(user, exercise));
});

/*
Used to get the exercise logs of any user.
*/
router.get("/users/:_id/logs", async (req, res) => {
  let user;
  let exercises;

  // Used to find the user.
  try {
    user = await User.findById({ _id: req.params._id });
    if (!user) throw new Error("No user found.");
  } catch (err) {
    res.status(404).json({ error: "You need to supply a valid user id." });
    return;
  }

  interface ExerciseQueryValues {
    userId: string,
    date?: any
  }

  let exerciseQueryValues : ExerciseQueryValues = { userId: req.params._id };

  // Optional parameters.
  if (req.query.from && req.query.to) {
    exerciseQueryValues.date = {
      $gte: new Date(Date.parse(String(req.query.from))),
      $lte: new Date(Date.parse(String(req.query.to))),
    };
  } else if (req.query.from) {
    exerciseQueryValues.date = {
      $gte: new Date(Date.parse(String(req.query.from))),
    };
  } else if (req.query.to) {
    exerciseQueryValues.date = { 
      $lte: new Date(Date.parse(String(req.query.to))),
    };
  }

  // Execute the query.
  if (req.query.limit) {
    exercises = await Exercise.find(exerciseQueryValues).limit(
      parseInt(String(req.query.limit), 10)
    );
  } else {
    exercises = await Exercise.find(exerciseQueryValues);
  }

  const logsDTO = getLogsDTO(user, exercises);
  res.status(200).json(logsDTO);
});

/*
Gets all the information required for the data page.
*/
router.get("/users/:_id/stats", async (req, res) => {
  let user;

  // Used to find the user.
  try {
    user = await User.findById({ _id: req.params._id });
    if (!user) throw new Error("No user found.");
  } catch (err) {
    res.status(404).json({ error: "You need to supply a valid user id." });
    return;
  }  

  const dailyStats = await getExerciseStats(req.params._id, "%Y-%m-%d");
  const monthlyStats = await getExerciseStats(req.params._id, "%Y-%m");
  const yearlyStats = await getExerciseStats(req.params._id, "%Y");
  const cumulativeStats = await getCumulativeExerciseStats(req.params._id);
  const statsList = [dailyStats, monthlyStats, yearlyStats, cumulativeStats];

  const statsDTO = getStatsDTO(user, statsList);
  res.status(200).json(statsDTO);
});

export default router;
