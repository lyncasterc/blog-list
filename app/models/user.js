/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [3, 'Username is too short!'],
    required: [true, 'Username is required!'],
  },
  name: String,
  passwordHash: {
    type: String,
    required: [true, 'Password is required!'],
  },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },

});

module.exports = mongoose.model('User', userSchema);
