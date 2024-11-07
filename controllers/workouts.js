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
  const workouts = await Workout.find({})
  response.json(workouts)
})

workoutsRouter.get('/:id', (request, response, next) => {
  const id = request.params.id
  Workout.findById(id)
    .then(workout => {
      if (workout) {
        response.json(workout)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

workoutsRouter.post('/', (request, response, next) => {
  const body = request.body

  const workout = new Workout({
    id: generateId(),
    workouts: body.workouts,
    likes: body.likes ? Number(body.likes) : 0,
    date: body.date ? body.date : new Intl.DateTimeFormat('en-GB').format(new Date()),
    detail: body.detail
  })

  workout.save()
    .then(savedWorkout => {
      response.status(201).json(savedWorkout)
    })
    .catch(error => next(error))
})

workoutsRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  Workout.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
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