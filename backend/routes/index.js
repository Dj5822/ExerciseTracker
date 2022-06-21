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

    res.json({
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
  try {
    const user = await User.findById({ _id: req.params._id });

    if (user) {
      if (!req.body.description || !req.body.duration) {
        res.json({
          error: "You need to supply the description and duration.",
        });
      } else {
        var exerciseDate = req.body.date;

        if (exerciseDate) {
          exerciseDate = new Date(Date.parse(exerciseDate));
        } else {
          exerciseDate = new Date();
        }

        const exercise = await new Exercise({
          userId: user._id,
          description: req.body.description,
          duration: req.body.duration,
          date: exerciseDate,
        });

        await exercise.save();

        res.json({
          _id: user._id,
          username: user.username,
          date: exerciseDate.toDateString(),
          duration: exercise.duration,
          description: exercise.description,
        });
      }
    } else {
      res.json({ error: "You need to suppy a valid id." });
    }
  } catch (err) {
    res.json({ error: "You need to suppy a valid id." });
  }
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
            description: exercise.description,
            duration: exercise.duration,
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
