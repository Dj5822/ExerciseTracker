const cors = require("cors");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/*
Connect to the database.
*/
const mySecret =
  "mongodb+srv://dj5822:xjE8yXCkex1da5Ih@cluster0.cdewt.mongodb.net/ExerciseDatabase?retryWrites=true&w=majority";
mongoose
  .connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

/*
Create user model.
*/
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

/*
Create exercise model.
*/
const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: Date,
});
const Exercise = mongoose.model("Exercise", exerciseSchema);

/*
Used to load the starting webpage.
*/
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

/*
Used to create a new user.
*/
app.post("/api/users", async (req, res) => {
  /*
  Should add the username and id to the database.
  */
  var user = await new User({ username: req.body.username });
  await user.save();

  res.json({
    username: user.username,
    _id: user._id,
  });
});

/*
Used to get a list of all the users.
*/
app.get("/api/users", async (req, res) => {
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
app.post("/api/users/:_id/exercises", async (req, res) => {
  if (!req.body.description || !req.body.duration) {
    res.json({
      error: "You need to supply the description, and duration.",
    });
  } else {
    var exerciseDate = req.body.date;

    if (exerciseDate) {
      exerciseDate = new Date(Date.parse(exerciseDate));
    } else {
      exerciseDate = new Date();
    }

    const exercise = await new Exercise({
      userId: req.params._id,
      description: req.body.description,
      duration: req.body.duration,
      date: exerciseDate,
    });

    await exercise.save();

    try {
      const user = await User.findById({ _id: req.params._id });

      if (user) {
        res.json({
          _id: user._id,
          username: user.username,
          description: exercise.description,
          duration: exercise.duration,
          date: exerciseDate.toDateString(),
        });
      } else {
        res.json({ error: "You need to suppy a valid id." });
      }
    } catch (err) {
      res.json({ error: "You need to suppy a valid id." });
    }
  }
});

/*
Used to get the exercise the logs of any user.
*/
app.get("/api/users/:id/logs", async (req, res) => {
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
            date: exercise.date,
          };
        }),
      };

      res.json(output);
    }
  } catch (err) {
    res.json({ error: err });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
