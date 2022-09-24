const mongoose = require('mongoose');

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true, dropDups: true}
});

const User = mongoose.model('User', userSchema);

const exerciseSchema = new Schema({
  _id: String,
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: String
})

const Exercise = mongoose.model('Exercise', exerciseSchema);

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
  User.findById(exerciseObj.id, (err, user) => {
    if (err) return console.log(err);

    if (user === null) return done({error: 'no user'});
  });

  let exercise = new Exercise({
    _id: exerciseObj.id,
    description: exerciseObj.description,
    duration: exerciseObj.duration,
    date: exerciseObj.date
  });

  exercise.save((err, data) => {
    if (err) return console.log(err);

    done(data);
  })
};

exports.User = User;
exports.Exercise = Exercise;
exports.createUser = createUser;
exports.createExercise = createExercise;
