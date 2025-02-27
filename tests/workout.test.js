const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// const generateId = () => {
//   // Generate two random lowercase letters (a-z)
//   const letter1 = String.fromCharCode(
//     Math.floor(Math.random() * 26) + 97 // First random letter
//   )

//   const letter2 = String.fromCharCode(
//     Math.floor(Math.random() * 26) + 97 // First random letter
//   )

//   // Generate two random digits (0-9)
//   const number1 = Math.floor(Math.random() * 9).toString()
//   const number2 = Math.floor(Math.random() * 9).toString()

//   // Combine the two letters and two digits
//   return letter1 + number1 + letter2 + number2
// }

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

  test('of a bigger list is calculated right', () => {

    const workouts = [
      {
        workouts: 'pull-ups',
        likes: 10,
        date: '5/7/2024',
      },
      {
        workouts: 'bench press',
        likes: 10,
        date: '5/7/2024',
      },
      { workouts: 'dumbbell press',
        likes: 10,
        date: '5/7/2024'
      }
    ]

    const result = listHelper.totalLikes(workouts)
    assert.strictEqual(result, 30)
  })
})

describe('favourite workout', () => {
  test('fav workout', () => {

    const workouts = [
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

    const mostLiked = listHelper.mostLikedWorkout(workouts)
    const secondWorkout = workouts[2]
    assert.strictEqual(mostLiked.likes, 20)
    assert.deepStrictEqual(secondWorkout, mostLiked)

    // Print the most liked workout with the following format :
    console.log({
      title: mostLiked.workouts,
      likes: mostLiked.likes,
      date: mostLiked.date,
    })
  })
})

describe('individue account', () => {
  test('with respect to their workout', () => {

    const accountsWithWorkouts = [
      {
        name: 'alex',
        workouts: 5,
      },
      {
        name: 'felix',
        workouts: 10,
      },
      {
        name: 'jabs',
        workouts: 20
      }
    ]

    const mostWorkouts = listHelper.accountWithMostWorkout(accountsWithWorkouts)
    const thirdPerson = accountsWithWorkouts[2]
    assert.strictEqual(mostWorkouts.workouts, 20)
    assert.deepStrictEqual(mostWorkouts, thirdPerson)

    // Print the most liked workout with the following format :
    // console.log({
    //   title: mostLiked.workouts,
    //   likes: mostLiked.likes,
    //   date: mostLiked.date,
    // })
  })
})