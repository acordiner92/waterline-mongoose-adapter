const FindQueryBuilder = () => {
  const inModifier = query => {
    return Object.entries(query).reduce((prev, [key, value]) => {
      const updateQuery = {
        ...prev
      };
      if (key !== '!' && Array.isArray(value) && key !== '$or') {
        updateQuery[key] = { $in: value };
      } else if (
        typeof value === 'object' &&
        !(value instanceof Date) &&
        !Array.isArray(value)
      ) {
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
      } else if (
        typeof value === 'object' &&
        !(value instanceof Date) &&
        !Array.isArray(value)
      ) {
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
      } else if (
        typeof value === 'object' &&
        !(value instanceof Date) &&
        !Array.isArray(value)
      ) {
        updateQuery[key] = criteriaModifiers(value);
      } else {
        updateQuery[key] = value;
      }
      return updateQuery;
    }, {});
  };

  const buildQuery = waterlineQuery => {
    const { where, or, ...otherFields } = waterlineQuery;
    let query = {
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
