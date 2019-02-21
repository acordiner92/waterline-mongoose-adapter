# waterline-mongoose-adapter
This is an mongoose adapter for waterline to ideally help a project migrate off using waterline onto mongoose. This reason this library was originally writen was the company I worked was looking migrate away from waterline but didn't want to entirely rewrite all the ORM in one go. With this library it will allow our team to slowly rewrite parts of the ORM at a time, while the rest of the application is still using the adapter.

## How to Install
```bash
$ npm i waterline-mongoose-adapter mongoose --save-dev
```

## How to use it
```javascript
const mongoose = require('mongoose')
const { WaterlineMongooseAdapter } = require('waterline-mongoose-adapter');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  { collection: 'User' }
);

const MongooseUser = mongoose.model('User', schema);
const User = WaterlineMongooseAdapter({ Model: MongooseUser });


const result = await User.find({ name: 'bob'});
```

## What is currently supported
### Methods
- [x] findOne
- [x] find
- [x] count
- [x] create
- [x] update
- [x] destroy
- [x] native
### query
- [x] limit
- [x] skip
- [x] sort
- [x] where
- [x] or
- [x] '<'
- [x] '<='
- [x] '>'
- [x] '>='
- [x] '!='
- [ ] 'nin'
- [ ] 'in'
- [ ] 'contains'
- [ ] 'startsWith'
- [ ] 'endsWith'

### License

waterline-mongoose-adapter is [MIT licensed](./LICENSE).
