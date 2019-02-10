const MongooseAdapter = ({ Model, ObjectId }) => {
  const findOne = id => Model.findById(id);

  const find = () => {
    // TODO: implement this
  };

  const create = model => Model.create(model);

  const update = async (id, model) => {
    await Model.updateOne({ _id: ObjectId(id) }, model);
    const updatedModel = await Model.findById(id);
    return [updatedModel];
  };

  const destroy = id => Model.findOneAndRemove(id);

  return {
    findOne,
    find,
    create,
    update,
    destroy
  };
};
module.exports = MongooseAdapter;
