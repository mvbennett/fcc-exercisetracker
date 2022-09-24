const mongoose = require('mongoose');

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  user_id: {type: String, required: true},
  username: {type: String, required: true},
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: String
})

const Exercise = mongoose.model('Exercise', exerciseSchema);

const userSchema = new Schema({
  username: {type: String, required: true, dropDups: true}
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
      user_id: user.id,
      username: user.username,
      description: exerciseObj.description,
      duration: exerciseObj.duration,
      date: parsedDate
    });

    exercise.save((err, data) => {
      if (err) return console.log(err);

      done(data);
    })
  });


};

const compileLogs = (userId, done) => {
  User.findById(userId, (err, user) => {
    if (err) return console.log(err);

    Exercise.find({user_id: userId})
            .select({description: 1, duration: 1, date: 1})
            .exec((err, exercises) => {
              if (err) return console.log(err);

              console.log(exercises);
              done({_id: user.id, username: user.username, count: exercises.length, log: exercises});
            });
  });
};

exports.User = User;
exports.Exercise = Exercise;
exports.createUser = createUser;
exports.createExercise = createExercise;
exports.compileLogs = compileLogs;
