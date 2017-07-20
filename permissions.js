/* 
  This section of the code handles anything to do with permissions
*/

const config = require('./config.json');

exports.isMoofle = (message) => {
  if (message.member.id === config.ownerID) {
    return true;
  }
  else {
    return false;
  }
}
