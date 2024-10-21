const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length < 5) {
  console.log('Usage: node mongo.js <password> <workout> <detail> <likes> [date]');
  process.exit(1);
}

const password = process.argv[2];
const workoutName = process.argv[3];
const workoutDetail = process.argv[4];
const workoutLikes = Number(process.argv[5]) ? Number(process.argv[5]) : 0  // Convert likes to a number
const workoutDate = process.argv[6] ? process.argv[6] : new Date().toISOString().split('T')[0];  // If date is provided, use it, otherwise use today's date

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

const workout = new Workout({
  workouts: 'Pull-ups',
  date: '2024-05-05',
  detail: "3 sets x 9 reps",
  likes: 0
})

// workout.save().then(result => {
//   console.log('workout saved!')
//   mongoose.connection.close()
// })

Workout.find({}).then(result => {
  result.forEach(workout => {
    console.log(workout)
  })
  mongoose.connection.close()
})