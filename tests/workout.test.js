const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const generateId = () => {
  // Generate two random lowercase letters (a-z)
  const letter1 = String.fromCharCode(
    Math.floor(Math.random() * 26) + 97 // First random letter
  )

  const letter2 = String.fromCharCode(
    Math.floor(Math.random() * 26) + 97 // First random letter
  )

  // Generate two random digits (0-9)
  const number1 = Math.floor(Math.random() * 9).toString()
  const number2 = Math.floor(Math.random() * 9).toString()

  // Combine the two letters and two digits
  return letter1 + number1 + letter2 + number2
}

test('dummy returns one', () => {
  const workouts = []

  const result = listHelper.dummy(workouts)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {

    const workouts = []

    const result = listHelper.totalLikes(workouts)
    assert.strictEqual(result, 0)
  })

  test('when list has only one workout equals the likes of that', () => {

    const workouts = []

    const newWorkout = {
      workouts: 'pull-ups',
      likes: 10,
      date: '5/7/2024',
    }

    workouts.push(newWorkout)

    const result = listHelper.totalLikes(workouts)
    assert.strictEqual(result, 10)
  })
})