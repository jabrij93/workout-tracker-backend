const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const workoutSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Workout = mongoose.model('Workout', workoutSchema)

const workout = new Workout({
  workouts: 'Pull-ups',
  date: '2024-05-05',
  detail: "3 sets x 9 reps",
  likes: "0"
})

workout.save().then(result => {
  console.log('workout saved!')
  mongoose.connection.close()
})