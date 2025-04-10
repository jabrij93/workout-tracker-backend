const workoutsRouter = require('express').Router()
const Workout = require('../models/workout')

const generateId = () => {
  // Generate two random lowercase letters (a-z)
  const letter1 = String.fromCharCode(
    Math.floor(Math.random() * 26) + 97 // First random letter
  )

  const letter2 = String.fromCharCode(
    Math.floor(Math.random() * 26) + 97 // First random letter
  )

  // Generate two random digits (0-9)
  const number1 = Math.floor(Math.random() * 9).toString()
  const number2 = Math.floor(Math.random() * 9).toString()

  // Combine the two letters and two digits
  return letter1 + number1 + letter2 + number2
}

workoutsRouter.get('/', async (request, response) => {
  const workouts = await Workout.find({}).populate('user', {
    username: 1,
    name: 1 // Specify fields you want from User model
  })
  console.log('workouts', workouts)
  response.json(workouts)
})

workoutsRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const workout = await Workout.findById(id)
  if (workout) {
    response.json(workout)
  } else {
    response.status(404).end()
  }
})

workoutsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = request.user

  // const user = await User.findById(body.userId)

  const workout = new Workout({
    id: generateId(),
    workouts: body.workouts,
    likes: body.likes === undefined ? 0 : Number(body.likes),
    date: body.date ? body.date : new Intl.DateTimeFormat('en-GB').format(new Date()),
    detail: body.detail,
    user: user.id
  })

  const savedWorkout = await workout.save()
  user.workouts = user.workouts.concat(savedWorkout._id)

  await user.save()

  console.log('Workout saved:', savedWorkout) // Log the saved workout
  response.status(201).json(savedWorkout)
})

workoutsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const user = request.user

  try {
    const workout = await Workout.findById(id)

    if (workout.user.toString() === user._id.toString()) {
      await Workout.findByIdAndDelete(id)
      response.status(204).end()
    } else {
      return response.status(403).json({ error: 'Unauthorized to delete this workout' })
    }
  } catch (error) {
    console.error('Error deleting workout:', error)
    return response.status(500).json({ error: 'Internal server error' })
  }
})

workoutsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const workout = {
    workouts: body.workouts,
    likes: body.likes,
    date: body.date ? body.date : new Intl.DateTimeFormat('en-GB').format(new Date()),
    detail: body.detail
  }

  const findWorkoutById = await Workout.findByIdAndUpdate
  (request.params.id,
    workout,
    { new: true, runValidators: true, context: 'query' }
  )

  if (!findWorkoutById) {
    return response.status(404).json({
      error: 'Blog post does not exist!!'
    })
  }

  response.json(findWorkoutById)
})

module.exports = workoutsRouter