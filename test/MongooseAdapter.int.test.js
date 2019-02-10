const { expect } = require('chai');
const { User, Book, Story } = require('../models');
const mongoose = require('../mongoose');
const MongooseAdapter = require('../MongooseAdapter');

describe('MongooseAdapter', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Book.deleteMany();
    await Story.deleteMany();
  });

  describe('findOne', () => {
    it('Check that document is returned', async () => {
      const mongooseAdapter = MongooseAdapter({
        Model: User,
        ObjectId: mongoose.Types.ObjectId
      });

      const result = await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });

      const match = await mongooseAdapter.findOne(result.id);
      expect(match.id).to.equal(result.id);
    });

    it('Check if no document is found, then null is returned', async () => {
      const mongooseAdapter = MongooseAdapter({
        Model: User,
        ObjectId: mongoose.Types.ObjectId
      });

      const match = await mongooseAdapter.findOne('56aa94de044befe2e79f5b5d');
      expect(match).to.equal(null);
    });
  });

  describe('find', () => {
    it('check a basic find query works', async () => {
      const mongooseAdapter = MongooseAdapter({
        Model: User,
        ObjectId: mongoose.Types.ObjectId
      });

      await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });

      const results = await mongooseAdapter.find({ firstName: 'harry' });
      expect(results.length).to.equal(1);
    });

    it('check a basic populate works', async () => {
      const mongooseAdapter = MongooseAdapter({
        Model: Book,
        ObjectId: mongoose.Types.ObjectId
      });

      const user = await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });

      const story = await Story.create({
        title: 'the boy who lived'
      });

      await Book.create({
        author: user.id,
        story: story.id
      });

      const fullBooks = await mongooseAdapter
        .find()
        .populate('author')
        .populate('story');

      const [fullBook] = fullBooks;

      expect(fullBook.author.id).to.equal(user.id);
      expect(fullBook.story.id).to.equal(story.id);
    });
  });

  describe('create', () => {
    it('check a model document is created successfully', async () => {
      const mongooseAdapter = MongooseAdapter({
        Model: User,
        ObjectId: mongoose.Types.ObjectId
      });

      const result = await mongooseAdapter.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });

      expect(result.firstName).to.equal('harry');
      expect(result.lastName).to.equal('potter');
      expect(result.age).to.equal(20);
    });
  });

  describe('update', () => {
    it('check a model document is updated successfully', async () => {
      const mongooseAdapter = MongooseAdapter({
        Model: User,
        ObjectId: mongoose.Types.ObjectId
      });

      const result = await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });

      const updatedResults = await mongooseAdapter.update(result.id, {
        firstName: 'ron'
      });

      const [updatedResult] = updatedResults;
      expect(updatedResult.firstName).to.equal('ron');
    });
  });

  describe('destroy', () => {
    it('check model document is deleted', async () => {
      const mongooseAdapter = MongooseAdapter({
        Model: User,
        ObjectId: mongoose.Types.ObjectId
      });

      const createdUser = await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });

      await mongooseAdapter.destroy(createdUser.id);

      const result = await User.findById(createdUser.id);
      expect(result).to.equal(null);
    });
  });

  describe('native', () => {
    it('check the models mongo collection is returned', done => {
      const mongooseAdapter = MongooseAdapter({
        Model: User,
        ObjectId: mongoose.Types.ObjectId
      });

      User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      })
        .then(() => {
          mongooseAdapter.native((err, collection) => {
            collection.find({}).toArray((error, users) => {
              expect(users.length).to.equal(1);
              done();
            });
          });
        })
        .catch(done);
    });
  });
});
