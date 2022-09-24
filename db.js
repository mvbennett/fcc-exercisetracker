const mongoose = require('mongoose');

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: String
})

const Exercise = mongoose.model('Exercise', exerciseSchema);

const userSchema = new Schema({
  username: {type: String, required: true, dropDups: true},
  log: [exerciseSchema]
});

const User = mongoose.model('User', userSchema);

const createUser = (username, done) => {
  User.findOne({username: username}, (err, user) => {
    if (err) return console.log(err);

    if (user === null) {
      let newUser = new User({username: username});

      newUser.save((err, user) => {
        if (err) return console.log(err);

        done(user);
      });
    } else {
      done(user);
    };
  });
};

const createExercise = (exerciseObj, done) => {
  User.findById(exerciseObj[':_id'], (err, user) => {
    if (err) return console.log(err);

    if (user === null) return done({error: 'no user'});

    let parsedDate;
    if (new Date(exerciseObj.date) === 'Invalid Date') {
      parsedDate = new Date(exerciseObj.date).toDateString();
    } else {
      parsedDate = new Date().toDateString();
    }

    let exercise = new Exercise({
      description: exerciseObj.description,
      duration: exerciseObj.duration,
      date: parsedDate
    });

    exercise.save((err, data) => {
      if (err) return console.log(err);

      user.log.push(data)
      done(data);
    })
  });


};

exports.User = User;
exports.Exercise = Exercise;
exports.createUser = createUser;
exports.createExercise = createExercise;
