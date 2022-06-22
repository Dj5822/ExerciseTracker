import express from "express";
import { User, Exercise } from "../db/schema";

const router = express.Router();

/*
Used to create a new user.
*/
router.post("/users", (req, res) => {
  const username = req.body.username;
  let user;

  // Check if the username is missing.
  if (!username) {
    res.statusCode = 404;
    res.send("Missing the username field in the request body.");
    return;
  }

  // Add the new user to the database.
  try {
    user = new User({ username: username });
    user.save();
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err });
    return;
  }  

  // Send response.
  res.statusCode = 201;
  res.json({
    username: user.username,
    _id: user._id,
  });
});

/*
Used to get a list of all the users.
*/
router.get("/users", async (req, res) => {
  const users = await User.find({});

  if (users) {
    res.send(users);
  } else {
    res.send("Could not find user.");
  }
});

/*
Used to post a new exercise.
*/
router.post("/users/:_id/exercises", async (req, res) => {
  let user;
  let exercise;
  let exerciseDate = req.body.date;

  // Check whether user exists.
  try {
    user = await User.findById({ _id: req.params._id });
  } catch (err) {
    res.statusCode = 404;
    res.json({ error: "You need to supply a valid user id." });
    return;
  }

  if (!user) {
    res.statusCode = 404;
    res.json({ error: "You need to supply a valid id." });
    return;
  }

  // Check whether parameters are not empty.
  if (!req.body.name || !req.body.quantity) {
    res.statusCode = 400;
    res.json({error: "You need to supply the name and quantity of the exercise."});
    return;
  }
    
  // Get the date of the exercise.
  if (exerciseDate) {
    exerciseDate = new Date(Date.parse(exerciseDate));
  } else {
    exerciseDate = new Date();
  }

  // Add new exercise to the database.
  try {
    exercise = new Exercise({
      userId: user._id,
      name: req.body.name,
      quantity: req.body.quantity,
      date: exerciseDate,
    });
  
    await exercise.save();
  }
  catch(err) {
    res.sendStatus(500);
    return;
  }

  // Send response.
  res.statusCode = 201;
  res.json({
    _id: user._id,
    userId: user.username,
    date: exerciseDate.toDateString(),
    quantity: exercise.quantity,
    name: exercise.name,
  });
});

/*
Used to get the exercise the logs of any user.
*/
router.get("/users/:_id/logs", async (req, res) => {
  let user;
  let exercises;

  // Used to find the user.
  try {
    user = await User.findById({ _id: req.params._id });
  } catch (err) {
    res.statusCode = 404;
    res.json({ error: "You need to supply a valid user id." });
    return;
  }

  if (!user) {
    res.statusCode = 404;
    res.json({ error: "You need to supply a valid id." });
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

  const output = {
    username: user.username,
    count: exercises.length,
    log: exercises.map((exercise) => {
      return {
        name: exercise.name,
        quantity: exercise.quantity,
        date: exercise.date.toDateString(),
      };
    }),
  };

  res.json(output);
});

export default router;
