const mongoose = require('mongoose')
const User = require('../models/user')

const workoutSchema = new mongoose.Schema({
  workouts: {
    type: String,
    minLength: 2,
    required: true,
  },
  date: {
    type: String,
    validate: {
      validator: function (value) {
        // Regular expression for matching "dd-mm-yyyy" or "dd/mm/yyyy" or single-digit day/month
        return /^(0?[1-9]|[12][0-9]|3[01])[-\/](0?[1-9]|1[0-2])[-\/]\d{4}$/.test(value)
      },
      message: props => `${props.value} is not a valid date format. Use dd-mm-yyyy or d-m-yyyy.`,
    },
  },
  detail: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

// Pre-save hook to reformat date to "dd-mm-yyyy"
workoutSchema.pre('save', function (next) {
  if (this.date) {
    // Detect separator and split accordingly
    const separator = this.date.includes('-') ? '-' : '/'
    const [day, month, year] = this.date.split(separator)

    // Pad day and month with leading zeroes if necessary
    const formattedDay = day.padStart(2, '0')
    const formattedMonth = month.padStart(2, '0')

    // Update the date to "dd-mm-yyyy" format
    this.date = `${formattedDay}-${formattedMonth}-${year}`
  }
  next()
})

workoutSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Workout', workoutSchema)