import express from "express";
import { User, Exercise } from "../db/schema";

const router = express.Router();

/*
Used to create a new user.
*/
router.post("/users", (req, res) => {
  const username = req.body.username;
  
  try {
    const user = new User({ username: username });
    user.save();

    res.sendStatus(201).json({
      username: user.username,
      _id: user._id,
    });
    
  } catch (err) {
    res.json({ error: err });
  }
});

/*
Used to get a list of all the users.
*/
router.get("/users", async (req, res) => {
  /*
    Should get usernames and ids from the database.
    */
  const users = await User.find({});

  if (users) {
    res.send(users);
  } else {
    res.send(err);
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
    res.json({ error: "You need to supply a valid user id." });
  }
  if (!user) res.json({ error: "You need to supply a valid id." });

  // Check whether parameters are not empty.
  if (!req.body.name || !req.body.quantity) {
    res.json({error: "You need to supply the name and quantity of the exercise."});
  }
    
  // Get the date of the exercise.
  if (exerciseDate) {
    exerciseDate = new Date(Date.parse(exerciseDate));
  } else {
    exerciseDate = new Date();
  }

  // Add new exercise to the database.
  try {
    exercise = await new Exercise({
      userId: user._id,
      name: req.body.name,
      quantity: req.body.quantity,
      date: exerciseDate,
    });
  
    await exercise.save();
  }
  catch(err) {
    res.sendStatus(500);
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
router.get("/users/:id/logs", async (req, res) => {
  // Used to find the user.
  try {
    const user = await User.findById({ _id: req.params.id });

    if (user) {
      // Base query.
      const exerciseQueryValues = { userId: user._id };

      // Optional parameters.
      if (req.query.from && req.query.to) {
        exerciseQueryValues.date = {
          $gte: new Date(Date.parse(req.query.from)),
          $lte: new Date(Date.parse(req.query.to)),
        };
      } else if (req.query.from) {
        exerciseQueryValues.date = {
          $gte: new Date(Date.parse(req.query.from)),
        };
      } else if (req.query.to) {
        exerciseQueryValues.date = { $lte: new Date(Date.parse(req.query.to)) };
      }

      var exercises;

      // Execute the query.
      if (req.query.limit) {
        exercises = await Exercise.find(exerciseQueryValues).limit(
          parseInt(req.query.limit, 10)
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
    }
  } catch (err) {
    res.json({ error: err });
  }
});

export default router;
