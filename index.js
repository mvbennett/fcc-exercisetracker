const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const { createExercise } = require('./db.js');
const createUser = require('./db.js').createUser;
const User = require('./db.js').User;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res, next) => {
  createUser(req.body['username'], (user) => {
    let id = user.id;
    let name = user.username;
    next(res.json({username: name, _id: id}));
  });
});

app.get('/api/users', (req, res) => {
  User.find({}, (err, users) => {
    res.json(users);
  });
});

app.post('/api/users/:id/exercises', (req, res, next) => {
  createExercise(req.body, (exercise) => {
    User.findById(req.params.id, (err, user) => {

      next(res.json({_id: exercise.user_id, username: exercise.username, description: exercise.description, duration: exercise.duration, date: exercise.date}))
    })

  })

  // User.findById(req.params.id, (err, user) => {
  //   if (err) return console.log(err)

  //   createExercise(req.body, (exercise) => {
  //     console.log(exercise);
  //     next(res.json(exercise));
  //   })
  // })
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
