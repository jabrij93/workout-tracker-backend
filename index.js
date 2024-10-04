const http = require('http')

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

  const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(workoutData))
  })

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)