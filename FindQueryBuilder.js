const FindQueryBuilder = () => {
  const isOnlyObject = obj =>
    typeof obj === 'object' && !(obj instanceof Date) && !Array.isArray(obj);

  const isArrayObjects = obj =>
    Array.isArray(obj) && obj.length > 0 && isOnlyObject(obj[0]);

  const inModifier = query => {
    return Object.entries(query).reduce((prev, [key, value]) => {
      const updateQuery = {
        ...prev
      };
      if (key !== '!' && Array.isArray(value) && key !== '$or') {
        updateQuery[key] = { $in: value };
      } else if (isOnlyObject(value)) {
        updateQuery[key] = inModifier(value);
      } else {
        updateQuery[key] = value;
      }
      return updateQuery;
    }, {});
  };

  const notInModifier = query => {
    return Object.entries(query).reduce((prev, [key, value]) => {
      let updateQuery = {
        ...prev
      };
      if (key === '!' && Array.isArray(value)) {
        updateQuery = { $nin: value };
      } else if (isOnlyObject(value)) {
        updateQuery[key] = notInModifier(value);
      } else {
        updateQuery[key] = value;
      }
      return updateQuery;
    }, {});
  };

  const criteriaModifiers = query => {
    const criterias = {
      '<': '$lt',
      '<=': '$lte',
      '>': '$gt',
      '>=': '$gte',
      '!=': '$ne',
      '!': '$ne'
    };
    return Object.entries(query).reduce((prev, [key, value]) => {
      const updateQuery = {
        ...prev
      };
      if (criterias[key]) {
        updateQuery[criterias[key]] = value;
      } else if (isOnlyObject(value)) {
        updateQuery[key] = criteriaModifiers(value);
      } else if (isArrayObjects(value)) {
        const res = value.map(x => criteriaModifiers(x));
        updateQuery[key] = res;
      } else {
        updateQuery[key] = value;
      }
      return updateQuery;
    }, {});
  };

  const buildQuery = waterlineQuery => {
    const { id, where, or, ...otherFields } = waterlineQuery;
    let query = {
      ...(id && { _id: id }),
      ...(where && { ...where }),
      ...(or && { $or: or }),
      ...otherFields
    };

    query = inModifier(query);
    query = notInModifier(query);
    query = criteriaModifiers(query);
    return query;
  };

  return {
    buildQuery
  };
};
module.exports = FindQueryBuilder;
