const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const workoutSchema = new mongoose.Schema({
    workouts: {
      type: String,
      minLength: 2,
      required: true,
    },
    date: {
      type: String,
      required: true,
      validate: {
          validator: function (value) {
              // Regular expression for matching "dd-mm-yyyy" or "d-m-yyyy"
              return /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-\d{4}$/.test(value);
          },
          message: props => `${props.value} is not a valid date format. Use dd-mm-yyyy or d-m-yyyy.`,
        },
    },
    detail: String,
    likes: Number
})

workoutSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Workout', workoutSchema)