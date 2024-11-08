const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Workout = require('../models/workout')

beforeEach(async () => {
  await Workout.deleteMany({})

  let workoutObject = new Workout(helper.initialWorkouts[0])
  await workoutObject.save()
  workoutObject = new Workout(helper.initialWorkouts[1])
  await workoutObject.save()
  workoutObject = new Workout(helper.initialWorkouts[2])
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

test('a valid workout can be added ', async () => {
  const newWorkout = {
    workouts: 'db shoulder press',
    likes: 12,
    date: '5/10/2024',
  }

  await api
    .post('/api/workouts')
    .send(newWorkout)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // const response = await api.get('/api/workouts')
  const workoutsAtEnd = await helper.workoutsInDb()
  console.log('workoutsAtEnd', workoutsAtEnd)
  assert.strictEqual(workoutsAtEnd.length, helper.initialWorkouts.length + 1)

  const workouts = workoutsAtEnd.map(r => r.workouts)

  assert(workouts.includes('db shoulder press'))
})

test.only('workout without \'workout\' will not be added', async () => {
  const newWorkout = {
    detail: '7 mins rest'
  }

  await api
    .post('/api/workouts')
    .send(newWorkout)
    .expect(400)

  const response = await helper.workoutsInDb()

  assert.strictEqual(response.length, helper.initialWorkouts.length)
})

after(async () => {
  await mongoose.connection.close()
})