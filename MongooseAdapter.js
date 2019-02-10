const MongooseAdapter = ({ Model, ObjectId }) => {
  const findOne = id => Model.findById(id);

  const find = query => Model.find(query);

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
