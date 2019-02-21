const { expect } = require('chai');
const { User, Book, Story } = require('../models');
const mongoose = require('../mongoose');
const MongooseAdapter = require('../MongooseAdapter');
const FindQueryBuilder = require('../FindQueryBuilder');

describe('MongooseAdapter', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Book.deleteMany();
    await Story.deleteMany();
  });

  describe('findOne', () => {
    it('Check that document is returned', async () => {
      const mongooseAdapter = MongooseAdapter({
        ObjectId: mongoose.Types.ObjectId
      })({ Model: User });

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
        ObjectId: mongoose.Types.ObjectId
      })({ Model: User });

      const match = await mongooseAdapter.findOne('56aa94de044befe2e79f5b5d');
      expect(match).to.equal(null);
    });
  });

  describe('find', () => {
    const findQueryBuilder = FindQueryBuilder();

    it('check a basic find query works', async () => {
      const mongooseAdapter = MongooseAdapter({
        ObjectId: mongoose.Types.ObjectId,
        findQueryBuilder
      })({ Model: User });

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
        findQueryBuilder,
        ObjectId: mongoose.Types.ObjectId
      })({ Model: Book });

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

    it('check limiting works', async () => {
      const mongooseAdapter = MongooseAdapter({
        ObjectId: mongoose.Types.ObjectId,
        findQueryBuilder
      })({ Model: User });

      await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });
      await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });

      const results = await mongooseAdapter.find({
        limit: 1
      });
      expect(results.length).to.equal(1);
    });

    it('check skip works', async () => {
      const mongooseAdapter = MongooseAdapter({
        ObjectId: mongoose.Types.ObjectId,
        findQueryBuilder
      })({ Model: User });

      await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });
      await User.create({
        firstName: 'hagrid',
        lastName: 'voldi',
        age: 20
      });

      const results = await mongooseAdapter.find({
        skip: 1
      });
      const [result] = results;
      expect(results.length).to.equal(1);
      expect(result.firstName).to.equal('hagrid');
    });

    it('check sort works', async () => {
      const mongooseAdapter = MongooseAdapter({
        ObjectId: mongoose.Types.ObjectId,
        findQueryBuilder
      })({ Model: User });

      await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });
      await User.create({
        firstName: 'hagrid',
        lastName: 'voldi',
        age: 20
      });

      const results = await mongooseAdapter.find({
        sort: 'firstName DESC'
      });
      const [result] = results;
      expect(result.firstName).to.equal('hagrid');
    });
  });

  describe('create', () => {
    it('check a model document is created successfully', async () => {
      const mongooseAdapter = MongooseAdapter({
        ObjectId: mongoose.Types.ObjectId
      })({ Model: User });

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
        ObjectId: mongoose.Types.ObjectId
      })({ Model: User });

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
    const findQueryBuilder = FindQueryBuilder();
    it('check model document is deleted', async () => {
      const mongooseAdapter = MongooseAdapter({
        findQueryBuilder,
        ObjectId: mongoose.Types.ObjectId
      })({ Model: User });

      const createdUser = await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });

      await mongooseAdapter.destroy(createdUser.id);

      const result = await User.findById(createdUser.id);
      expect(result).to.equal(null);
    });

    it('check model document is deleted via query', async () => {
      const mongooseAdapter = MongooseAdapter({
        findQueryBuilder,
        ObjectId: mongoose.Types.ObjectId
      })({ Model: User });

      await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });

      await User.create({
        firstName: 'voldemort',
        lastName: 'potter',
        age: 20
      });

      await mongooseAdapter.destroy({ firstName: 'voldemort' });

      const count = await User.countDocuments();
      expect(count).to.equal(1);
    });
  });

  describe('native', () => {
    it('check the models mongo collection is returned', done => {
      const mongooseAdapter = MongooseAdapter({
        ObjectId: mongoose.Types.ObjectId
      })({ Model: User });

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

  describe('count', async () => {
    const findQueryBuilder = FindQueryBuilder();
    it('check count of model works with no query param', async () => {
      const mongooseAdapter = MongooseAdapter({
        findQueryBuilder,
        ObjectId: mongoose.Types.ObjectId
      })({ Model: User });

      await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });

      const count = await mongooseAdapter.count();

      expect(count).to.equal(1);
    });

    it('check count of model works with query param', async () => {
      const mongooseAdapter = MongooseAdapter({
        findQueryBuilder,
        ObjectId: mongoose.Types.ObjectId
      })({ Model: User });

      await User.create({
        firstName: 'harry',
        lastName: 'potter',
        age: 20
      });

      await User.create({
        firstName: 'voldemort',
        lastName: 'potter',
        age: 20
      });

      const count = await mongooseAdapter.count({ firstName: 'voldemort' });

      expect(count).to.equal(1);
    });
  });
});
