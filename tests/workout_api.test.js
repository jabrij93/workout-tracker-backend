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

  const workoutObject = helper.initialWorkouts.map(workout => new Workout(workout))
  const promiseArray = workoutObject.map(workout => workout.save())
  await Promise.all(promiseArray)
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

test('workout without \'workout\' will not be added', async () => {
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

test('a specific workout can be viewed', async () => {
  const workoutsAtStart = await helper.workoutsInDb()

  const workoutToView = workoutsAtStart[0]

  const resultWorkout = await api
    .get(`/api/workouts/${workoutToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultWorkout.body, workoutToView)
})

test.only('verifies that the unique identifier property is named id', async () => {
  const workoutsAtStart = await helper.workoutsInDb()

  const workoutToView = workoutsAtStart[0]

  const resultWorkout = await api
    .get(`/api/workouts/${workoutToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  console.log('resultWorkout', resultWorkout)

  assert.deepStrictEqual(resultWorkout._body.id, '67310a57cdb22d91b435d67e')
})

test('a workout can be deleted', async () => {
  const workoutsAtStart = await helper.workoutsInDb()
  const workoutToDelete = workoutsAtStart[0]

  await api
    .delete(`/api/workouts/${workoutToDelete.id}`)
    .expect(204)

  const workoutsAtEnd = await helper.workoutsInDb()

  const workouts = workoutsAtEnd.map(r => r.workouts)
  assert(!workouts.includes(workoutToDelete.workouts))

  assert.strictEqual(workoutsAtEnd.length, helper.initialWorkouts.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})