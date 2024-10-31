const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const workouts = []

  const result = listHelper.dummy(workouts)
  assert.strictEqual(result, 1)
})