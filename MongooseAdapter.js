const MongooseAdapter = ({ ObjectId, findQueryBuilder }) => ({ Model }) => {
  const findOne = id => Model.findById(id);

  const getSort = sortValue => {
    const [field, order] = sortValue.split(' ');
    const sort = {};
    sort[field] = order === 'ASC' ? -1 : 1;
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

  const update = async (id, model) => {
    await Model.updateOne({ _id: ObjectId(id) }, model);
    const updatedModel = await Model.findById(id);
    return [updatedModel];
  };

  const destroy = id => Model.findOneAndDelete({ _id: ObjectId(id) });

  const native = cb => {
    cb(null, Model.collection);
  };

  return {
    findOne,
    find,
    create,
    update,
    destroy,
    native
  };
};
module.exports = MongooseAdapter;
