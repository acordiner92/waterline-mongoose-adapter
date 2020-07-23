const objectIdToString = require('./objectIdToString');

module.exports = function LeanObjectIdToString(schema) {
  schema.post('find', objectIdToString);
  schema.post('findOne', objectIdToString);
};
