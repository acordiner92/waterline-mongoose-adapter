const isObjectId = value => {
  if (!value) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  if (
    proto == null ||
    proto.constructor == null ||
    proto.constructor.name !== 'ObjectID'
  ) {
    return false;
  }
  return value._bsontype === 'ObjectID';
};

const isOnlyObject = obj =>
  typeof obj === 'object' &&
  !(obj instanceof Date) &&
  !Array.isArray(obj) &&
  obj !== null;

const isArrayObjects = obj =>
  Array.isArray(obj) && obj.length > 0 && isOnlyObject(obj[0]);

const convertObject = obj => {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    if (isObjectId(value) && key !== '_id') {
      // eslint-disable-next-line no-param-reassign
      prev[key] = value.toString();
    } else if (isObjectId(value) && key === '_id') {
      // eslint-disable-next-line no-param-reassign
      prev.id = value.toString();
    } else if (isOnlyObject(value)) {
      // eslint-disable-next-line no-param-reassign
      prev[key] = convertObject(value);
    } else if (isArrayObjects(value)) {
      const res = value.map(x => convertObject(x));
      // eslint-disable-next-line no-param-reassign
      prev[key] = res;
    }
    return obj;
  }, obj);
};

const objectIdToString = function objectIdToString(value) {
  if (!this._mongooseOptions.lean || !value) {
    return value;
  }
  if (isArrayObjects(value)) {
    return value.map(x => convertObject(x));
  }
  return convertObject(value);
};
module.exports = objectIdToString;
