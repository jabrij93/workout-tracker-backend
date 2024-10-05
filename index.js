const express = require('express')
const app = express()

let workoutData = [
    {
      "workouts": "pull-ups",
      "likes": 5,
      "id": "e05b",
      "date": "2024-02-22"
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
      "likes": 4
    }
]

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
    response.status(404).end
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})