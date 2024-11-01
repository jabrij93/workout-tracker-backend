const dummy = (workouts) => {
  return 1
}

const totalLikes = (workouts) => {
  return workouts.reduce((sum, workout) => sum + workout.likes, 0)
}

const mostLikedWorkout = (workouts) => {
  return workouts.reduce((max, workout) => workout.likes > max.likes ? workout : max, workouts[0])
}

module.exports = {
  dummy, totalLikes, mostLikedWorkout
}