const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testing', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
module.exports = mongoose;
