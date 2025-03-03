const router = require('express').Router()
const Workout = require('../models/workout')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Workout.deleteMany({})
  // await User.deleteMany({})

  response.status(204).end()
})

module.exports = router