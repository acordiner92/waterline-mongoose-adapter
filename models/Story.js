const mongoose = require('../mongoose');

const Story = mongoose.model('Story', {
  title: String
});
module.exports = Story;
