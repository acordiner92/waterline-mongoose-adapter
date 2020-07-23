const objectIdToString = require('./objectIdToString');

module.exports = function LeanObjectIdToStringToStringPlugin(schema) {
  schema.post('find', objectIdToString);
  schema.post('findOne', objectIdToString);
};
