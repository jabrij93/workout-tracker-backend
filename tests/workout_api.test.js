const { test, after, beforeEach } = require('node:test')
const Workout = require('../models/workout')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

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

beforeEach(async () => {
  await Workout.deleteMany({})
  let workoutObject = new Workout(initialWorkouts[0])
  await workoutObject.save()
  workoutObject = new Workout(initialWorkouts[1])
  await workoutObject.save()
  workoutObject = new Workout(initialWorkouts[2])
  await workoutObject.save()
})

test('workouts are returned as json', async () => {
  await api
    .get('/api/workouts')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three workouts', async () => {
  const response = await api.get('/api/workouts')

  assert.strictEqual(response.body.length, 3)
})

test('the first workout is about pull-ups', async () => {
  const response = await api.get('/api/workouts')

  const workouts = response.body.map(e => e.workouts)
  assert.strictEqual(workouts.includes('pull-ups'), true)
})

test.only('a valid workout can be added ', async () => {
  const newWorkout = {
    workouts: 'db shoulder press',
    likes: 12,
    date: '7/10/2024',
  }

  await api
    .post('/api/workouts')
    .send(newWorkout)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/workouts')

  const workouts = response.body.map(r => r.workout)

  assert.strictEqual(response.body.length, initialWorkouts.length + 1)

  assert(workouts.includes('db shoulder press'))
})

after(async () => {
  await mongoose.connection.close()
})