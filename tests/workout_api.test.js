const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('workouts are returned as json', async () => {
  await api
    .get('/api/workouts')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are one workout', async () => {
  const response = await api.get('/api/workouts')

  assert.strictEqual(response.body.length, 1)
})

// test('the first workout is about pull-ups', async () => {
//   const response = await api.get('/api/workouts')

//   const contents = response.body.map(e => e.content)
//   assert.strictEqual(contents.includes('pull-ups'), true)
// })

after(async () => {
  await mongoose.connection.close()
})