/* 
  This section of the code handles anything to do with permissions.
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

exports.isUser = (message) => {
  if (message.member.roles.has(config.roleID)) {
    return true;
  }
  else {
    return false;
  }
}

exports.isAdmin = (message) => {
  if (message.member.roles.has(config.adminID)) {
    return true;
  }
  else {
    return false;
  }
}
