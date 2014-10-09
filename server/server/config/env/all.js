var path = require('path'),
rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  apiPort: process.env.PORT || 3000,
  "appPort-http": (process.env.PORT+1) || 3001,
  "appPort-https": 3002,
  db: process.env.MONGOHQ_URL
};
