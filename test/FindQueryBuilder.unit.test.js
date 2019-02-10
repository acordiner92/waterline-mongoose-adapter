const { expect } = require('chai');
const FindQueryBuilder = require('../FindQueryBuilder');

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

    it('if an array value is present it is converted to $in', () => {
      const findQueryBuilder = FindQueryBuilder();
      const query = findQueryBuilder.buildQuery({
        colours: ['blue', 'green', 'yellow']
      });
      expect(query).to.eql({
        colours: { $in: ['blue', 'green', 'yellow'] }
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
  });
});
