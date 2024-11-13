const workoutsRouter = require('express').Router()
const Workout = require('../models/workout')
const User = require('../models/user')

const { usersInDb } = require('../tests/test_helper')

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
  const workouts = await Workout.find({})
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

  const user = await User.findById(body.userId)

  const workout = new Workout({
    id: generateId(),
    workouts: body.workouts,
    likes: body.likes ? Number(body.likes) : 0,
    date: body.date ? body.date : new Intl.DateTimeFormat('en-GB').format(new Date()),
    detail: body.detail,
    user: user.id
  })

  const savedWorkout = await workout.save()
  user.workouts = user.workouts.concat(savedWorkout._id)
  await user.save()

  response.status(201).json(savedWorkout)
})

workoutsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Workout.findByIdAndDelete(id)
  response.status(204).end()
})

workoutsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const workout = {
    workouts: body.workouts,
    likes: body.likes ? Number(body.likes) : 0,
    date: body.date ? body.date : new Intl.DateTimeFormat('en-GB').format(new Date()),
    detail: body.detail
  }

  Workout.findByIdAndUpdate(request.params.id, workout, { new: true })
    .then(updatedWorkout => {
      response.json(updatedWorkout)
    })
    .catch(error => next(error))
})

module.exports = workoutsRouter