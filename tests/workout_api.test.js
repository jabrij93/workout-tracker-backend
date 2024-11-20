const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

const Workout = require('../models/workout')

beforeEach(async () => {
  await Workout.deleteMany({})
  await User.deleteMany({})

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'salainen' }); // Replace with valid credentials

  const token = loginResponse.body.token // Adjust according to your API's response format

  const workoutObject = helper.initialWorkouts.map(workout => new Workout(workout))
  const promiseArray = workoutObject.map(workout => workout.save())
  await Promise.all(promiseArray)
})

test.only('workouts are returned as json', async () => {
  await api
    .get('/api/workouts')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('there are three workouts', async () => {
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

  const workoutsAtEnd = await helper.workoutsInDb()

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

test('workout without \'likes\', \'likes\' value default to 0', async () => {
  const newWorkout = {
    workouts: 'weighted pull-ups'
  }

  await api
    .post('/api/workouts')
    .send(newWorkout)
    .expect(201)

  const response = await helper.workoutsInDb()

  assert.strictEqual(response.length, helper.initialWorkouts.length + 1)
  assert.strictEqual(response[3].likes, 0)
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

test('verifies that likes can be increased to a stored data in db', async () => {
  const workoutsAtStart = await helper.workoutsInDb()
  console.log('workoutsAtStart', workoutsAtStart)

  const workoutToView = workoutsAtStart[2]

  // const resultWorkout = await api
  //   .get(`/api/workouts/${workoutToView.id}`)
  const resultWorkout = await api
    .put(`/api/workouts/${workoutToView.id}`)
    .send({ ...workoutToView, likes: workoutToView.likes + 1 })

  console.log('resultWorkoutbody', resultWorkout.body)

  assert.strictEqual(resultWorkout.body.likes, 11)
})

test('verifies that the unique identifier property of the data is \'id\'', async () => {
  const workoutsAtStart = await helper.workoutsInDb()

  const workoutToView = workoutsAtStart[0]

  const resultWorkout = await api
    .put(`/api/workouts/${workoutToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.ok(Object.prototype.hasOwnProperty.call(resultWorkout._body, 'id'))
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

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('login', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      password: 'salainen',
    }

    await api
      .post('/api/login')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})