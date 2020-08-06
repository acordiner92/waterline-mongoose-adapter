const { expect } = require('chai');
const { Types } = require('mongoose');
const objectIdToString = require('../objectIdToString');

global._mongooseOptions = {
  lean: true
};

describe('objectIdToString', () => {
  it('if the value is not set, then undefined is returned', () => {
    expect(objectIdToString()).to.equal(undefined);
  });

  it('check object with ObjectId field is converted to string', () => {
    const value = {
      objectId: Types.ObjectId('5f03f1e320d23f43ff7c0a3d')
    };
    const result = objectIdToString(value);
    expect(result).to.eql({
      objectId: '5f03f1e320d23f43ff7c0a3d'
    });
  });

  it('check object with _id remains ObjectId and created id field', () => {
    const value = {
      _id: Types.ObjectId('5f03f1e320d23f43ff7c0a3d')
    };
    const result = objectIdToString(value);
    expect(result).to.eql({
      _id: Types.ObjectId('5f03f1e320d23f43ff7c0a3d'),
      id: '5f03f1e320d23f43ff7c0a3d'
    });
  });

  it('check object with other fields are not converted to string', () => {
    const value = {
      otherValue: 100
    };
    const result = objectIdToString(value);
    expect(result).to.eql({
      otherValue: 100
    });
  });

  it('check object with nested ObjectId are converted to string', () => {
    const value = {
      beforeValue: Types.ObjectId('5f03f1e320d23f43ff7c0a3d'),
      otherValue: {
        objectId: Types.ObjectId('5f03f1e320d23f43ff7c0a3d')
      },
      afterValue: Types.ObjectId('5f03f1e320d23f43ff7c0a3d')
    };
    const result = objectIdToString(value);
    expect(result).to.eql({
      beforeValue: '5f03f1e320d23f43ff7c0a3d',
      otherValue: {
        objectId: '5f03f1e320d23f43ff7c0a3d'
      },
      afterValue: '5f03f1e320d23f43ff7c0a3d'
    });
  });

  it('check object with array of objects that have ObjectIds are converted to string', () => {
    const value = {
      beforeValue: Types.ObjectId('5f03f1e320d23f43ff7c0a3d'),
      otherValues: [
        {
          objectId: Types.ObjectId('5f03f1e320d23f43ff7c0a3d')
        }
      ],
      afterValue: Types.ObjectId('5f03f1e320d23f43ff7c0a3d')
    };
    const result = objectIdToString(value);
    expect(result).to.eql({
      beforeValue: '5f03f1e320d23f43ff7c0a3d',
      otherValues: [
        {
          objectId: '5f03f1e320d23f43ff7c0a3d'
        }
      ],
      afterValue: '5f03f1e320d23f43ff7c0a3d'
    });
  });

  it('check array of objects that have ObjectIds are converted to string', () => {
    const values = [
      {
        objectId: Types.ObjectId('5f03f1e320d23f43ff7c0a3d')
      },
      {
        objectId: Types.ObjectId('5f03f1e320d23f43ff7c0a3d')
      }
    ];
    const result = objectIdToString(values);
    expect(result).to.eql([
      {
        objectId: '5f03f1e320d23f43ff7c0a3d'
      },
      {
        objectId: '5f03f1e320d23f43ff7c0a3d'
      }
    ]);
  });

  it('check array of objects that have nested objects with ObjectIds are converted to string', () => {
    const values = [
      {
        beforeValue: Types.ObjectId('5f03f1e320d23f43ff7c0a3d'),
        otherValues: [
          {
            objectId: Types.ObjectId('5f03f1e320d23f43ff7c0a3d')
          }
        ],
        afterValue: Types.ObjectId('5f03f1e320d23f43ff7c0a3d')
      }
    ];
    const result = objectIdToString(values);
    expect(result).to.eql([
      {
        beforeValue: '5f03f1e320d23f43ff7c0a3d',
        otherValues: [
          {
            objectId: '5f03f1e320d23f43ff7c0a3d'
          }
        ],
        afterValue: '5f03f1e320d23f43ff7c0a3d'
      }
    ]);
  });
});
