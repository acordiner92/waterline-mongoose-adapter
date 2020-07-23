const objectIdToString = require('./objectIdToString');

module.exports = function mongooseLeanObjectIdToString(schema) {
  schema.post('find', objectIdToString);
  schema.post('findOne', objectIdToString);
};
