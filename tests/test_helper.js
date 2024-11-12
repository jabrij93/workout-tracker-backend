const Workout = require('../models/workout')

const initialWorkouts = [
  {
    workouts: 'pull-ups',
    likes: 10,
    date: '5/7/2024',
  },
  {
    workouts: 'bench press',
    likes: 15,
    date: '5/7/2024',
  },
  { workouts: 'dumbbell press',
    likes: 20,
    date: '5/7/2024'
  }
]

const nonExistingId = async () => {
  const workout = new Workout({ workouts: 'willremovethissoon' })
  await workout.save()
  await workout.deleteOne()

  return workout._id.toString()
}

const workoutsInDb = async () => {
  const workouts = await Workout.find({})
  return workouts.map(workout => workout.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialWorkouts, nonExistingId, workoutsInDb, usersInDb
}