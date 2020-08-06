const { expect } = require('chai');
const FindQueryBuilder = require('../FindQueryBuilder');
const mongoose = require('../mongoose');

const { ObjectId } = mongoose.Types;

describe('FindQueryBuilder', () => {
  describe('buildQuery', () => {
    it('if where cause is present, check its values are added to root of query', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        where: { firstName: 'harry' }
      });
      expect(query).to.eql({
        firstName: 'harry'
      });
    });

    it('if where cause is not present, then nothing is added', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({});
      expect(query).to.eql({});
    });

    it('make sure null case is handled', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        expired: null
      });
      expect(query).to.eql({ expired: null });
    });

    it('if id is present then _id is added', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({ id: { '!': 'xxx' } });
      expect(query).to.eql({ _id: { $ne: 'xxx' } });
    });

    it('if nested id is present then _id is added', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        or: [{ size: { '<': 5 } }, { id: 7 }]
      });
      expect(query).to.eql({ $or: [{ size: { $lt: 5 } }, { _id: 7 }] });
    });

    it('if an array value is present it is converted to $in', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        colours: ['blue', 'green', 'yellow']
      });
      expect(query).to.eql({
        colours: { $in: ['blue', 'green', 'yellow'] }
      });
    });

    it('if a value is a object id then it remains unmodified', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        userId: ObjectId('5a6eb8988e7f81b7b07524c2')
      });
      expect(query).to.eql({
        userId: ObjectId('5a6eb8988e7f81b7b07524c2')
      });
    });

    it('if an array value is present and it has object ids they remain unmodified', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        userIds: [ObjectId('5a6eb8988e7f81b7b07524c2')]
      });
      expect(query).to.eql({
        userIds: { $in: [ObjectId('5a6eb8988e7f81b7b07524c2')] }
      });
    });

    it('if nested value is array value is present it is converted to $in', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        firstName: 'harry',
        selection: {
          colours: ['blue', 'green', 'yellow']
        }
      });
      expect(query).to.eql({
        firstName: 'harry',
        selection: {
          colours: { $in: ['blue', 'green', 'yellow'] }
        }
      });
    });

    it('if nested arrays objects value is an array, it is converted to $nin', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        where: {
          firstName: 'harry',
          or: [
            {
              colours: ['blue', 'green', 'yellow']
            }
          ]
        }
      });
      expect(query).to.eql({
        firstName: 'harry',
        $or: [
          {
            colours: { $in: ['blue', 'green', 'yellow'] }
          }
        ]
      });
    });

    it('if nested arrays objects value ! is present it is converted to $nin', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        firstName: 'harry',
        or: [
          {
            colours: { '!': ['blue', 'green', 'yellow'] }
          }
        ]
      });
      expect(query).to.eql({
        firstName: 'harry',
        $or: [
          {
            colours: { $nin: ['blue', 'green', 'yellow'] }
          }
        ]
      });
    });

    it('check nested modifiers are converted correctly', () => {
      const findQueryBuilder = FindQueryBuilder();
      const from = new Date();
      const to = new Date();
      const query = findQueryBuilder.buildQuery({
        or: [
          {
            swId: 'yyy',
            from: {
              '>=': from,
              '<': to
            }
          },
          {
            swId: 'yyy',
            to: {
              '<=': to,
              '>': from
            }
          },
          {
            clientId: 'xxx',
            from: {
              '>=': from,
              '<': to
            }
          },
          {
            clientId: 'xxx',
            to: {
              '<=': to,
              '>': from
            }
          }
        ]
      });
      expect(query).to.eql({
        $or: [
          {
            swId: 'yyy',
            from: {
              $gte: from,
              $lt: to
            }
          },
          {
            swId: 'yyy',
            to: {
              $lte: to,
              $gt: from
            }
          },
          {
            clientId: 'xxx',
            from: {
              $gte: from,
              $lt: to
            }
          },
          {
            clientId: 'xxx',
            to: {
              $lte: to,
              $gt: from
            }
          }
        ]
      });
    });

    it('if an array value with ! is present it is converted to $nin', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        colours: { '!': ['blue', 'green', 'yellow'] }
      });
      expect(query).to.eql({
        colours: { $nin: ['blue', 'green', 'yellow'] }
      });
    });

    it('if nested value with ! is array value is present it is converted to $nin', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        firstName: 'harry',
        selection: {
          colours: { '!': ['blue', 'green', 'yellow'] }
        }
      });
      expect(query).to.eql({
        firstName: 'harry',
        selection: {
          colours: { $nin: ['blue', 'green', 'yellow'] }
        }
      });
    });

    it('if or cause is present, check its values are added to $or', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        or: [{ firstName: 'harry' }, { lastName: 'potter' }]
      });
      expect(query).to.eql({
        $or: [{ firstName: 'harry' }, { lastName: 'potter' }]
      });
    });

    it('if where cause is not present, then nothing is added', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({});
      expect(query).to.eql({});
    });

    it('if a value with < is present it is converted to $lt', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        age: { '<': 7 }
      });
      expect(query).to.eql({
        age: { $lt: 7 }
      });
    });

    it('if a value with <= is present it is converted to $lt', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        age: { '<=': 7 }
      });
      expect(query).to.eql({
        age: { $lte: 7 }
      });
    });

    it('if a value with > is present it is converted to $lt', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        age: { '>': 7 }
      });
      expect(query).to.eql({
        age: { $gt: 7 }
      });
    });

    it('if a value with > and < is present it is converted to $gt and $le', () => {
      const findQueryBuilder = FindQueryBuilder();
      const dateOne = new Date();
      const dateTwo = new Date();
      const query = findQueryBuilder.buildQuery({
        age: { '>': dateOne, '<': dateTwo }
      });
      expect(query).to.eql({
        age: { $gt: dateOne, $lt: dateTwo }
      });
    });

    it('if a value with < is present it is converted to $lt', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        age: { '>=': 7 }
      });
      expect(query).to.eql({
        age: { $gte: 7 }
      });
    });

    it('if a value with < is present it is converted to $lt', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        age: { '!=': 7 }
      });
      expect(query).to.eql({
        age: { $ne: 7 }
      });
    });

    it('if a value with ! is present it is converted to $ne', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        age: { '!': 7 }
      });
      expect(query).to.eql({
        age: { $ne: 7 }
      });
    });
  });
});
