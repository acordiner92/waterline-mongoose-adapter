const mongoose = require('../mongoose');

const User = mongoose.model('User', {
  firstName: String,
  lastName: String,
  age: Number
});
module.exports = User;
