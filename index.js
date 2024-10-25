const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const Workout = require('./models/workout')

const path = require('path'); 
const axios = require('axios');

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
  
app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use(express.static('dist'))

const generateId = () => {
  // Generate two random lowercase letters (a-z)
  const letter1 = String.fromCharCode(
    Math.floor(Math.random() * 26) + 97 // First random letter
  );

  const letter2 = String.fromCharCode(
    Math.floor(Math.random() * 26) + 97 // First random letter
  );

  // Generate two random digits (0-9)
  const number1 = Math.floor(Math.random() * 9).toString()
  const number2 = Math.floor(Math.random() * 9).toString()

  // Combine the two letters and two digits
  return letter1 + number1 + letter2 + number2
};

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/workout', (request, response) => {
  Workout.find({}).then(workout=> {
    response.json(workout);
  })
  .catch(error => {
    console.log(error)
    response.status(500).end()
  })
})

app.get('/api/workout/:id', (request, response, next) => {
  const id = request.params.id;
  Workout.findById(id).then(workout=> {
    if (workout) {
      response.json(workout)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.post('/api/workout', (request, response) => { 
  const body = request.body;

  if (!body.workouts) {
    return response.status(400).json({
      error: 'workout missing'
    })
  }

  const workout = new Workout({
    id: generateId(),
    workouts: body.workouts,
    likes: Number(body.likes), 
    date: body.date,
    detail: body.detail
  })

  workout.save().then(savedWorkout => {
    response.json(savedWorkout)
  })
})

app.put('/api/workout/:id', async (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const workout = {
    workouts: body.workouts,
    likes: body.likes ? Number(body.likes) : 0, 
    date: body.date,
    detail: body.detail
  }

  Workout.findByIdAndUpdate(id, workout, {new : true})
    .then(updatedWorkout => {
      response.json(updatedWorkout)
    })
})

app.delete('/api/workout/:id', (request, response, next) => {
  const id = request.params.id
  Workout.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})