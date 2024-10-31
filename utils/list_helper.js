const dummy = (workouts) => {
  return 1
}

const totalLikes = (workouts) => {
  return workouts.reduce((sum, workout) => sum + workout.likes, 0)
}

module.exports = {
  dummy, totalLikes
}