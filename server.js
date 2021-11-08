const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({
  extended: true
}))

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

  res.json({
    "username": req.body.username,
    "_id": "test"
  });
});

/*
Used to get a list of all the users.
*/



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
