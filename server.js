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
  })
});

/*
Used to post a new exercise.
*/
app.post('/api/users/:_id/exercises', (req, res) => {
  console.log(req.body);
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
