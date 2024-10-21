const mongoose = require('mongoose')
require('dotenv').config()

const password = process.argv[2];
const workoutName = process.argv[3];
const workoutDetail = process.argv[4];
// Check if the 5th argument is a number (likes), otherwise treat it as a date or skip
let workoutLikes;
let workoutDate;

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

const workoutSchema = new mongoose.Schema({
  workouts: String,
  date: String,
  detail: String,
  likes: Number
})

const Workout = mongoose.model('Workout', workoutSchema)

// Check if only the password is provided to list all workouts
if (process.argv.length === 3) {
  Workout.find({})
    .then((result) => {
      result.forEach((workout) => {
        console.log(workout);
      });
      mongoose.connection.close();
    })
} else if (process.argv.length >= 4) {
  // If workout details are provided, proceed to save a new workout entry

  // Check if the 5th argument is a number (likes), otherwise treat it as a date or skip
  let workoutLikes;
  let workoutDate;

  if (process.argv[5] && !isNaN(process.argv[5])) {
    // If the 5th argument is a number, it's likes, and we expect date to be in the 6th argument
    workoutLikes = Number(process.argv[5]);
    workoutDate = process.argv[6] ? process.argv[6] : new Date().toISOString().split('T')[0];
  } else {
    // If the 5th argument is not a number, it's the date and likes should default to 0
    workoutLikes = 0;
    workoutDate = process.argv[5] ? process.argv[5] : new Date().toISOString().split('T')[0];
  }

  const workout = new Workout({
    workouts: workoutName,
    date: workoutDate,
    detail: workoutDetail,
    likes: workoutLikes,
  });

  workout
    .save()
    .then((result) => {
      console.log('Workout saved!');
      mongoose.connection.close();
    })
} else {
  console.log('Usage: node mongo.js <password> <workout> <detail> [likes] [date]');
  mongoose.connection.close();
}