var User = require('../models/user');

module.exports = {
  name: 'user',
  namespace: false,
  Model: User.Model,
  params: ['authUserId', 'instruments', 'likes', 'created']
};