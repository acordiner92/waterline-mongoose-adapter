const { Schema } = require('mongoose');
const mongoose = require('../mongoose');

const Book = mongoose.model('Book', {
  story: { type: Schema.Types.ObjectId, ref: 'Story' },
  author: { type: Schema.Types.ObjectId, ref: 'User' }
});
module.exports = Book;
