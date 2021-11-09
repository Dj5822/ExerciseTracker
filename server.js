const cors = require('cors')
const bodyParser = require('body-parser')
var mongoose = require('mongoose')
const express = require('express')
const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({
  extended: true
}))

/*
Connect to the database.
*/
const mySecret = "mongodb+srv://dj5822:xjE8yXCkex1da5Ih@cluster0.cdewt.mongodb.net/ExerciseDatabase?retryWrites=true&w=majority";
mongoose.connect(mySecret, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

/*
Create user model.
*/
const userSchema = new mongoose.Schema({
  username: { type: String, required: true}
});
const User = mongoose.model("User", userSchema);

/*
Create exercise model.
*/
const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true},
  description: { type: String, required: true},
  duration: { type: Number, required: true},
  date: Date
});
const Exercise = mongoose.model("Exercise", exerciseSchema);

/*
Used to load the starting webpage.
*/
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

/*
Used to create a new user.
*/
app.post('/api/users', (req, res) => {
  /*
  Should add the username and id to the database.
  */
  var user = new User({ username: req.body.username });
  user.save();

  res.json({
    "username": user.username,
    "_id": user._id
  });
});

/*
Used to get a list of all the users.
*/
app.get('/api/users', (req, res) => {
  /*
  Should get usernames and ids from the database.
  */
  var output = [];

  User.find({}, function(err, users) {
    users.forEach(function(user) {
      output.push(user);
    });
    res.send(output);
  });
});

/*
Used to post a new exercise.
*/
app.post('/api/users/:_id/exercises', (req, res) => {
  var exerciseDate = req.body.date;

  if (req.params._id === "" && req.body.description === "" && req.body.duration === "") {
    res.json({error: "You need to supply the id, description, and duration."});
  }
  else {
    if (exerciseDate === "") {
      exerciseDate = new Date();
    }
    else {
      exerciseDate = new Date(Date.parse(exerciseDate));
    }

    var exercise = new Exercise({
      userId: req.params._id,
      description: req.body.description,
      duration: req.body.duration,
      date: exerciseDate
    });

    exercise.save();

    User.findById({ _id: req.params._id }, function(err, data) {
      if (err) return console.log(err);
      if (data != null) {
        res.json({
          _id: data._id,
          username: data.username,
          description: exercise.description,
          duration: exercise.duration,
          date: exerciseDate.toDateString()
        });
      }
    });    
  }
});

/*
Used to get the exercise the logs of any user.
*/
app.get('/api/users/:id/logs', (req, res) => {
  User.findById({ _id: req.params.id }, function(err, user) {
    if (err) {
      return console.log(err);
    }
    else if (user != null) {
      var exerciseList = [];

      Exercise.find({ userId: user._id }, (err, exercises) => {
        exercises.forEach(ex => {
          if (ex.userId != null) {
            exerciseList.push({
              description: ex.description,
              duration: ex.duration,
              date: ex.date.toDateString()
            });
          }
        });
     
        res.json({
          _id: user._id,
          username: user.username,
          count: exerciseList.length,
          log: exerciseList
        });
      });
    }
    else {
      res.send("Unknown userId");
    }
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
