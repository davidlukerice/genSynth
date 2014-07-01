
// TODO: Move ids out to a config file that's dev/production specific
var adminIds = [ 'davidlukerice@gmail.com' ];

function userIsAdmin(userId) {
  console.log('checking userId: ' + userId);
  for (var i = 0; i < adminIds.length; i++) {
    console.log('checking adminId: ' + adminIds[i]);
    if (adminIds[i] == userId) {
      return true;
    }
  }
}

exports.userIsAdmin = userIsAdmin;
