const express = require('express')
const app = express()

app.use(express.json())
const cors = require('cors')

app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

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
      "id": "3130",
      "workouts": "test add workout",
      "likes": 8,
      "date": "2024-03-25"
    },
    {
      "id": "4e15",
      "workouts": "sit-ups",
      "likes": 4,
      "date": "2024-07-24"
    }
]

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
  response.json(workoutData)
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

app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})