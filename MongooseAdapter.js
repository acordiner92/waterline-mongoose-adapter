const MongooseAdapter = ({ ObjectId, findQueryBuilder }) => ({ Model }) => {
  const findOne = async queryOrId => {
    const model = await Model.find({
      ...(typeof queryOrId === 'string' && { _id: ObjectId(queryOrId) }),
      ...(typeof queryOrId !== 'string' &&
        findQueryBuilder.buildQuery(queryOrId))
    });
    return model.length > 0 ? model[0] : undefined;
  };

  const getSort = sortValue => {
    const [field, order] = sortValue.split(' ');
    const sort = {};
    sort[field] = order === 'ASC' ? 1 : -1;
    return sort;
  };

  const find = (query = {}) => {
    const { limit, skip, sort, ...restOfQuery } = query;
    const mongooseQuery = findQueryBuilder.buildQuery(restOfQuery);
    return Model.find(mongooseQuery)
      .skip(skip)
      .limit(limit)
      .sort({
        ...(sort ? getSort(sort) : { _id: 1 })
      });
  };

  const create = model => Model.create(model);

  const update = async (queryOrId, model) => {
    const matches =
      typeof queryOrId === 'string'
        ? [await findOne(queryOrId)]
        : await Model.find(findQueryBuilder.buildQuery(queryOrId));

    const results = await Promise.all(
      matches.map(async x => {
        await Model.updateOne({ _id: ObjectId(x.id) }, model);
        return findOne(x.id);
      })
    );

    return results;
  };

  const updateOne = async (queryOrId, model) => {
    const matched = await findOne(queryOrId);
    if (!matched) {
      throw Error('could not find document');
    }
    await Model.updateOne(
      findQueryBuilder.buildQuery(
        typeof queryOrId === 'string' ? { id: queryOrId } : queryOrId
      ),
      model
    );

    return findOne(matched.id);
  };

  const destroy = queryOrId =>
    Model.deleteMany({
      ...(typeof queryOrId === 'string' && { _id: ObjectId(queryOrId) }),
      ...(typeof queryOrId !== 'string' &&
        findQueryBuilder.buildQuery(queryOrId))
    });

  const native = cb => {
    cb(null, Model.collection);
  };

  const count = (query = {}) => {
    const mongooseQuery = findQueryBuilder.buildQuery(query);
    return Model.countDocuments(mongooseQuery);
  };

  return {
    findOne,
    find,
    create,
    update,
    updateOne,
    destroy,
    native,
    count
  };
};
module.exports = MongooseAdapter;
