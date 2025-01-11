const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const api = supertest(app)
const Workout = require('../models/workout')

beforeEach(async () => {
  await Workout.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salainen', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  const workoutObject = helper.initialWorkouts.map(workout => new Workout(workout))
  const promiseArray = workoutObject.map(workout => workout.save())
  await Promise.all(promiseArray)
})

const getAuthToken = async (username, password) => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username, password })

  return loginResponse.body.token
}

test('workouts are returned as json', async () => {
  const token = await getAuthToken('root', 'salainen')

  await api
    .get('/api/workouts')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three workouts', async () => {
  const token = await getAuthToken('root', 'salainen')

  const response = await api.get('/api/workouts')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 3)
})

test('the first workout is about bench press', async () => {
  const token = await getAuthToken('root', 'salainen')

  const response = await api.get('/api/workouts')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const workouts = response.body.map(e => e.workouts)
  assert.strictEqual(workouts.includes('bench press'), true)
})

test('a valid workout can be added ', async () => {
  const token = await getAuthToken('root', 'salainen')

  const newWorkout = {
    workouts: 'db shoulder press',
    likes: 12,
    date: '5/10/2024',
  }

  await api
    .post('/api/workouts')
    .set('Authorization', `Bearer ${token}`)
    .send(newWorkout)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const workoutsAtEnd = await helper.workoutsInDb()

  assert.strictEqual(workoutsAtEnd.length, helper.initialWorkouts.length + 1)

  const workouts = workoutsAtEnd.map(r => r.workouts)

  assert(workouts.includes('db shoulder press'))
})

test('workout without \'workout\' will not be added', async () => {
  const token = await getAuthToken('root', 'salainen')
  const newWorkout = {
    detail: '7 mins rest'
  }

  await api
    .post('/api/workouts')
    .set('Authorization', `Bearer ${token}`)
    .send(newWorkout)
    .expect(400)

  const response = await helper.workoutsInDb()

  assert.strictEqual(response.length, helper.initialWorkouts.length)
})

test('workout without \'likes\', \'likes\' value default to 0', async () => {
  const token = await getAuthToken('root', 'salainen')

  const newWorkout = {
    workouts: 'weighted pull-ups'
  }

  await api
    .post('/api/workouts')
    .set('Authorization', `Bearer ${token}`)
    .send(newWorkout)
    .expect(201)

  const response = await helper.workoutsInDb()

  assert.strictEqual(response.length, helper.initialWorkouts.length + 1)
  assert.strictEqual(response[3].likes, 0)
})

test('a specific workout can be viewed', async () => {
  const token = await getAuthToken('root', 'salainen')
  const workoutsAtStart = await helper.workoutsInDb()

  const workoutToView = workoutsAtStart[0]

  const resultWorkout = await api
    .get(`/api/workouts/${workoutToView.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultWorkout.body, workoutToView)
})

test('verifies that likes can be increased to a stored data in db', async () => {
  const token = await getAuthToken('root', 'salainen')
  const workoutsAtStart = await helper.workoutsInDb()
  console.log('workoutsAtStart', workoutsAtStart)

  const workoutToView = workoutsAtStart[2]

  // const resultWorkout = await api
  //   .get(`/api/workouts/${workoutToView.id}`)
  const resultWorkout = await api
    .put(`/api/workouts/${workoutToView.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ ...workoutToView, likes: workoutToView.likes + 1 })

  console.log('resultWorkoutbody', resultWorkout.body)

  assert.strictEqual(resultWorkout.body.likes, 11)
})

test('verifies that the unique identifier property of the data is \'id\'', async () => {
  const token = await getAuthToken('root', 'salainen')
  const workoutsAtStart = await helper.workoutsInDb()

  const workoutToView = workoutsAtStart[0]

  const resultWorkout = await api
    .put(`/api/workouts/${workoutToView.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.ok(Object.prototype.hasOwnProperty.call(resultWorkout._body, 'id'))
})

test('a workout can be deleted', async () => {
  let token = await getAuthToken('root', 'salainen')

  const newWorkout = {
    workouts: 'weighted pull-ups',
    likes: 12,
    date: '10/10/2024',
  }

  // Create a new workout
  await api
    .post('/api/workouts')
    .set('Authorization', `Bearer ${token}`)
    .send(newWorkout)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Fetch workouts from the database
  const workoutsBeforeDelete = await helper.workoutsInDb()
  console.log('Workouts before delete:', workoutsBeforeDelete)

  // Find the workout to delete
  const workoutToDelete = workoutsBeforeDelete.find(
    (workout) => workout.workouts === 'weighted pull-ups'
  )
  console.log('Workout to delete:', workoutToDelete)

  // Ensure the workout is added successfully
  assert.strictEqual(workoutsBeforeDelete.length, helper.initialWorkouts.length + 1)
  assert(workoutToDelete !== undefined)

  // Delete the workout
  await api
    .delete(`/api/workouts/${workoutToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  // Fetch workouts again
  const workoutsAfterDelete = await helper.workoutsInDb()
  console.log('Workouts after delete:', workoutsAfterDelete)

  // Verify the workout is deleted
  const workoutNames = workoutsAfterDelete.map((r) => r.workouts)
  assert(!workoutNames.includes('weighted pull-ups'))

  // Verify the length is back to the initial count
  assert.strictEqual(workoutsAfterDelete.length, helper.initialWorkouts.length)
})

describe.only('create new user', () => {
  test.only('login user', async () => {
    const usersAtStart = await helper.usersInDb()

    const passwordHash = await bcrypt.hash('salainen', 10)
    const user = new User({ username: 'mluukkai', passwordHash })

    await user.save()

    const newUser = {
      username: 'mluukkai',
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