const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const password = process.argv[2];
const workoutName = process.argv[3];
const workoutDetail = process.argv[4];
// Check if the 5th argument is a number (likes), otherwise treat it as a date or skip
let workoutLikes;
let workoutDate;

const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const workoutSchema = new mongoose.Schema({
  workouts: String,
  date: String,
  detail: String,
  likes: Number
})

const Workout = mongoose.model('Workout', workoutSchema)

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

let workoutData = [
  {
    "workouts": "pull-ups",
    "likes": 5,
    "id": "e05b",
    "date": "2024-09-08"
  },
  {
    "workouts": "dips",
    "likes": 3,
    "id": "dfb1",
    "date": "2024-02-23"
  },
  {
    "workouts": "push-up",
    "likes": 2,
    "id": "f11b",
    "date": "2024-01-24"
  },
  {
    "id": "4e15",
    "workouts": "sit-ups",
    "likes": 4,
    "date": "2024-07-24"
  },
  {
    "workouts": "bench press",
    "date": "2024-06-03",
    "detail": "10kg, 3 sets x 8 reps",
    "likes": 0,
    "id": "KvbmWhU"
  },
  {
    "id": "r6q5",
    "workouts": "incline db row",
    "date": "2024-05-15",
    "detail": "3 sets x 12 reps",
    "likes": 0
  }
]

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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/workout', (request, response) => {
  Workout.find({}).then(workouts => {
    response.json(workouts);
  });
})

app.get('/api/workout/:id', (request, response) => {
  const id = request.params.id;
  const workout = workoutData.find(workout => workout.id === id)

  if (workout) {
    response.json(workout)
  } else {
    response.status(404).end();
  }
})

app.post('/api/workout', (request, response) => {
  const body = request.body;

  if (!body.workouts) {
    return response.status(400).json({
      error: 'workout missing'
    })
  }

  const workout2 = {
    id: generateId(),
    workouts: body.workouts,
    likes: Number(body.likes), 
    date: body.date,
    detail: body.detail
  }

  workoutData = workoutData.concat(workout2)

  console.log(workoutData)
  response.json(workout2)
})

app.delete('/api/workout/:id', (request, response) => {
  const id = request.params.id
  workout = workoutData.filter(workout => workout.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})