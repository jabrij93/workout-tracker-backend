const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

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

workout.save().then(result => {
  console.log('workout saved!')
  mongoose.connection.close()
})